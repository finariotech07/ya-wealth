const crypto = require('crypto');
const db = require('../config/db');

const OTP_EXPIRY_MINUTES = 10; // can be overridden per use case

function generateRawOtp(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

function hashOtp(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

async function insertOtp({ userId, operation, rawOtp, targetEmail, expiresInMinutes = OTP_EXPIRY_MINUTES }) {
    // Limit: Only 3 OTPs per user per operation in the last 30 minutes
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const now = new Date();
    const since = new Date(now - THIRTY_MINUTES);
    const recentOtps = await db('otps')
        .where({ user_id: userId, operation })
        .andWhere('created_at', '>', since)
        .count('id as count');
    if (recentOtps[0].count >= 3) {
        throw new Error('OTP request limit reached. Please try again later.');
    }
    const otpHash = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await db('otps').insert({
        user_id: userId,
        otp_hash: otpHash,
        operation,
        target_email: targetEmail || null,
        expires_at: expiresAt,
        used: false
    });

    return { rawOtp, expiresAt };
}

async function validateOtp({ userId, operation, providedOtp }) {
    const otpHash = hashOtp(providedOtp);

    const row = await db('otps')
        .where({
            user_id: userId,
            operation,
            otp_hash: otpHash,
            used: false
        })
        .andWhere('expires_at', '>', db.raw('NOW()'))
        .orderBy('created_at', 'desc')
        .first();

    if (!row) return { valid: false };

    return {
        valid: true,
        otpId: row.id,
        targetEmail: row.target_email
    };
}

async function markOtpAsUsed(otpId) {
    await db('otps').where({ id: otpId }).update({ used: true });
}

async function expireOldOtps(userId, operation) {
    await db('otps')
        .where({ user_id: userId, operation, used: false })
        .andWhere('expires_at', '<', db.raw('NOW()'))
        .update({ used: true });
}

async function getLastOtp({ userId, operation }) {
    const row = await db('otps')
        .where({ user_id: userId, operation })
        .orderBy('created_at', 'desc')
        .first();
    return row || null;
}

module.exports = {
    generateRawOtp,
    insertOtp,
    validateOtp,
    markOtpAsUsed,
    expireOldOtps,
    getLastOtp,
    hashOtp
};
