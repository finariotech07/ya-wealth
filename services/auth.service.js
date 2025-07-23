const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const { generateRawOtp, insertOtp, validateOtp, markOtpAsUsed, getLastOtp } = require('../utils/otps');
const { sendEmail } = require('../utils/emails');
const { signToken } = require('./jwt.service');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;

async function signup(userData) {
    // Check if user with this email exists
    const existingUser = await UserModel.findUserByEmail(userData.email);
    if (existingUser) {
        if (existingUser.is_verified) {
            throw new Error('Email already in use');
        } else {
            // Unverified user exists, resend OTP
            const rawOtp = generateRawOtp();
            await insertOtp({ userId: existingUser.id, operation: 'signup', rawOtp, targetEmail: existingUser.email });
            await sendEmail({
                to: existingUser.email,
                subject: 'Verify Your Email',
                html: `<p>Your OTP is <b>${rawOtp}</b>. It expires in 10 minutes.</p>`
            });
            return { userId: existingUser.id, message: 'OTP resent to email (unverified user)' };
        }
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const newUser = {
        ...userData,
        password: hashedPassword,
        is_verified: false,
        auth_provider: 'manual'
    };

    const { id } = await UserModel.createUser(newUser);

    const rawOtp = generateRawOtp();
    await insertOtp({ userId: id, operation: 'signup', rawOtp, targetEmail: newUser.email });

    await sendEmail({
        to: newUser.email,
        subject: 'Verify Your Email',
        html: `<p>Your OTP is <b>${rawOtp}</b>. It expires in 10 minutes.</p>`
    });

    return { userId: id, message: 'OTP sent to email' };
}

async function verifyOtp(userId, otpCode) {
    const result = await validateOtp({ userId, operation: 'signup', providedOtp: otpCode });

    if (!result.valid) {
        throw new Error('Invalid or expired OTP');
    }

    await markOtpAsUsed(result.otpId);
    await UserModel.updateUserById(userId, { is_verified: true });

    const user = await UserModel.findUserById(userId);

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role_id
    });

    return { token, user };
}

async function login(email, plainPassword) {
    const user = await UserModel.returnPassword(email);

    if (!user || !user.is_verified) {
        throw new Error('Invalid credentials or unverified account');
    }


    const validPassword = await bcrypt.compare(plainPassword, user.password);

    if (!validPassword) {
        throw new Error('Invalid credentials');
    }

    const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role_id
    });

    return {
        user: user.id,
        email: user.email,
        token,
        fname: user.fname,
        lname: user.lname,
        role: user.role_id,
        phone: user.phone
    };
}

async function resendOtp(userId, email) {
    const operation = 'signup';
    const lastOtp = await getLastOtp({ userId, operation });
    if (lastOtp) {
        const lastSent = new Date(lastOtp.created_at);
        const now = new Date();
        const diffMs = now - lastSent;
        if (diffMs < 3 * 60 * 1000) {
            const secondsLeft = Math.ceil((3 * 60 * 1000 - diffMs) / 1000);
            throw new Error(`Please wait ${secondsLeft} seconds before requesting another OTP.`);
        }
    }
    const rawOtp = generateRawOtp();
    await insertOtp({ userId, operation, rawOtp, targetEmail: email });
    await sendEmail({
        to: email,
        subject: 'Verify Your Email',
        html: `<p>Your OTP is <b>${rawOtp}</b>. It expires in 10 minutes.</p>`
    });
    return { message: 'OTP resent to email' };
}

async function logout(userId) {
    // Stateless JWT: logout is handled on client by deleting token
    return { message: 'Logged out successfully' };
}

async function requestEmailChange(userId, newEmail) {
    // Check if newEmail is already in use
    const existing = await UserModel.findUserByEmail(newEmail);
    if (existing) {
        throw new Error('Email already in use');
    }
    // Generate OTP and store for email_change
    const rawOtp = generateRawOtp();
    await insertOtp({ userId, operation: 'email_change', rawOtp, targetEmail: newEmail });
    await sendEmail({
        to: newEmail,
        subject: 'Verify Your New Email',
        html: `<p>Your OTP for changing email is <b>${rawOtp}</b>. It expires in 10 minutes.</p>`
    });
    return { message: 'OTP sent to new email' };
}

async function verifyEmailChangeOtp(userId, otpCode) {
    // Find latest unused, unexpired OTP for email_change
    const result = await validateOtp({ userId, operation: 'email_change', providedOtp: otpCode });
    if (!result.valid) {
        throw new Error('Invalid or expired OTP');
    }
    // Update user's email to the target email in OTP record
    const otpRow = await getLastOtp({ userId, operation: 'email_change' });
    if (!otpRow || otpRow.used || otpRow.otp_hash !== require('../utils/otps').hashOtp(otpCode)) {
        throw new Error('OTP mismatch');
    }
    const user = await UserModel.findUserById(userId);
    const oldEmail = user.email;
    await UserModel.updateUserById(userId, { email: otpRow.target_email });
    await markOtpAsUsed(otpRow.id);
    // Optional: Notify old email
    if (oldEmail) {
        await sendEmail({
            to: oldEmail,
            subject: 'Your email was changed',
            html: `<p>Your account email was changed to <b>${otpRow.target_email}</b>. If this wasn't you, contact support immediately.</p>`
        });
    }
    return { message: 'Email updated successfully' };
}

async function requestPasswordReset(email) {
    // Always respond generically
    const user = await UserModel.findUserByEmail(email);
    if (user) {
        const rawOtp = generateRawOtp();
        await insertOtp({ userId: user.id, operation: 'password_reset', rawOtp, targetEmail: user.email });
        await sendEmail({
            to: user.email,
            subject: 'Password Reset OTP',
            html: `<p>Your OTP for password reset is <b>${rawOtp}</b>. It expires in 10 minutes.</p>`
        });
    }
    return { message: 'If this email exists, an OTP has been sent.' };
}

async function verifyPasswordResetOtp(email, otp) {
    const user = await UserModel.findUserByEmail(email);
    if (!user) throw new Error('Invalid OTP or email');
    const result = await validateOtp({ userId: user.id, operation: 'password_reset', providedOtp: otp });
    if (!result.valid) throw new Error('Invalid or expired OTP');
    await markOtpAsUsed(result.otpId);
    // Issue short-lived JWT for password reset
    const token = jwt.sign(
        { id: user.id, email: user.email, op: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    return { token };
}

async function resetPassword(token, newPassword) {
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        throw new Error('Invalid or expired token');
    }
    if (payload.op !== 'password_reset') {
        throw new Error('Invalid token operation');
    }
    const user = await UserModel.findUserById(payload.id);
    if (!user) throw new Error('User not found');
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await UserModel.updateUserById(user.id, { password: hashedPassword });
    return { message: 'Password has been reset successfully' };
}

async function listUsers() {
    const users = await UserModel.searchUsers();
    return users;
}

async function modifyUserById(userId, updates) {
    const allowedFields = ['email', 'fname', 'lname', 'phone', 'role_id', 'is_verified'];
    const updateData = {};
    for (const key of allowedFields) {
        if (updates[key] !== undefined) updateData[key] = updates[key];
    }
    if (Object.keys(updateData).length === 0) {
        throw new Error('No valid fields to update');
    }
    const success = await UserModel.updateUserById(userId, updateData);
    if (!success) throw new Error('User not found or not updated');
    return { message: 'User updated successfully' };
}

async function deleteUserById(userId) {
    const success = await UserModel.deleteUserById(userId);
    if (!success) throw new Error('User not found or not deleted');
    return { message: 'User deleted successfully' };
}

module.exports = {
    signup,
    verifyOtp,
    login,
    resendOtp,
    logout,
    requestEmailChange,
    verifyEmailChangeOtp,
    requestPasswordReset,
    verifyPasswordResetOtp,
    resetPassword,
    listUsers,
    modifyUserById,
    deleteUserById
};
