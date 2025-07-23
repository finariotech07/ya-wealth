const { z } = require('zod');

// 🔒 Central schema validator middleware
function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body); // parsed + typed
            next();
        } catch (err) {
            const message = err.errors?.[0]?.message || 'Invalid request data';
            return res.status(422).json({ success: false, message });
        }
    };
}

// ✳️ Signup schema
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fname: z.string().min(1),
    lname: z.string().min(1),
    phone: z.string().regex(/^\d{10,15}$/, 'Phone number must be 10-15 digits')
});

// ✳️ Login schema
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

// ✳️ OTP verify schema
const otpVerifySchema = z.object({
    userId: z.number().int().positive(),
    otp: z.string().length(6, 'OTP must be 6 digits')
});

// ✳️ Resend OTP schema
const resendOtpSchema = z.object({
    userId: z.number().int().positive(),
    email: z.string().email()
});

// ✳️ Request Email Change schema
const requestEmailChangeSchema = z.object({
    newEmail: z.string().email()
});

// ✳️ Verify Email Change OTP schema
const verifyEmailChangeOtpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits')
});

// ✳️ Request Password Reset schema
const requestPasswordResetSchema = z.object({
    email: z.string().email()
});

// ✳️ Verify Password Reset OTP schema
const verifyPasswordResetOtpSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6, 'OTP must be 6 digits')
});

// ✳️ Reset Password schema
const resetPasswordSchema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(6)
});

module.exports = {
    validateSignup: validate(signupSchema),
    validateLogin: validate(loginSchema),
    validateOtpVerify: validate(otpVerifySchema),
    validateResendOtp: validate(resendOtpSchema),
    validateRequestEmailChange: validate(requestEmailChangeSchema),
    validateVerifyEmailChangeOtp: validate(verifyEmailChangeOtpSchema),
    validateRequestPasswordReset: validate(requestPasswordResetSchema),
    validateVerifyPasswordResetOtp: validate(verifyPasswordResetOtpSchema),
    validateResetPassword: validate(resetPasswordSchema),
};
