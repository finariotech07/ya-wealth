const { signup, verifyOtp, login, resendOtp, logout } = require('../services/auth.service');

const AuthController = {
    async signup(req, res) {
        try {
            const result = await signup(req.body);
            res.status(201).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async verifyOtp(req, res) {
        try {
            const { userId, otp } = req.body;
            const result = await verifyOtp(userId, otp);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await login(email, password);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(401).json({ success: false, message: err.message });
        }
    },

    async resendOtp(req, res) {
        try {
            const { userId, email } = req.body;
            const result = await resendOtp(userId, email);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async logout(req, res) {
        try {
            const result = await logout(req.user.id);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async requestEmailChange(req, res) {
        try {
            const { newEmail } = req.body;
            const userId = req.user.id;
            const result = await require('../services/auth.service').requestEmailChange(userId, newEmail);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async verifyEmailChangeOtp(req, res) {
        try {
            const { otp } = req.body;
            const userId = req.user.id;
            const result = await require('../services/auth.service').verifyEmailChangeOtp(userId, otp);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const result = await require('../services/auth.service').requestPasswordReset(email);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async verifyPasswordResetOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const result = await require('../services/auth.service').verifyPasswordResetOtp(email, otp);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            const result = await require('../services/auth.service').resetPassword(token, newPassword);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    async listUsers(req, res) {
        try {
            const users = await require('../services/auth.service').listUsers();
            res.status(200).json({ success: true, users });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
    async modifyUserById(req, res) {
        try {
            const userId = req.params.id;
            const updates = req.body;
            const result = await require('../services/auth.service').modifyUserById(userId, updates);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },
    async deleteUserById(req, res) {
        try {
            const userId = req.params.id;
            const result = await require('../services/auth.service').deleteUserById(userId);
            res.status(200).json({ success: true, ...result });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
};

module.exports = AuthController;
