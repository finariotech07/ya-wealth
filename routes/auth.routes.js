const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { validateSignup, validateLogin, validateOtpVerify, validateResendOtp, validateRequestEmailChange, validateVerifyEmailChangeOtp, validateRequestPasswordReset, validateVerifyPasswordResetOtp, validateResetPassword } = require('../validations/auth.validations');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/auth/signup', validateSignup, AuthController.signup);
router.post('/auth/verify-otp', validateOtpVerify, AuthController.verifyOtp);
router.post('/auth/resend-otp', validateResendOtp, AuthController.resendOtp);
router.post('/auth/login', validateLogin, AuthController.login);
router.post('/auth/logout', AuthController.logout);
router.post('/auth/request-email-change', authMiddleware, validateRequestEmailChange, AuthController.requestEmailChange);
router.post('/auth/verify-email-change-otp', authMiddleware, validateVerifyEmailChangeOtp, AuthController.verifyEmailChangeOtp);
router.post('/auth/request-password-reset', validateRequestPasswordReset, AuthController.requestPasswordReset);
router.post('/auth/verify-password-reset-otp', validateVerifyPasswordResetOtp, AuthController.verifyPasswordResetOtp);
router.post('/auth/reset-password', validateResetPassword, AuthController.resetPassword);

//admin routes
router.get('/auth/users', authMiddleware, authMiddleware.adminOnly, AuthController.listUsers);
router.put('/auth/users/:id', authMiddleware, authMiddleware.adminOnly, AuthController.modifyUserById);
router.delete('/auth/users/:id', authMiddleware, authMiddleware.adminOnly, AuthController.deleteUserById);

module.exports = router;
