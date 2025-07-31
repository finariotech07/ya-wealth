const { verifyToken } = require('../services/jwt.service');

// Define role constants directly in this file
const ROLES = {
    USER: 1,
    ADMIN: 2,
    AUTHOR: 3,
    LEADSMANAGER: 4
};

const ROLE_NAMES = {
    1: 'user',
    2: 'admin',
    3: 'author',
    4: 'leadsmanager'
};

function authMiddleware(req, res, next) {
    if (!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    req.user = {
        ...decoded,
        roleId: decoded.role,
        roleName: ROLE_NAMES[decoded.role] || 'unknown',
    };
    next();
}

function adminOnly(req, res, next) {
    if (req.user && req.user.roleId === ROLES.ADMIN) {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden: Admins only' });
}

// Update editorOnly to authorOnly for correct role
function authorOnly(req, res, next) {
    if (req.user && req.user.roleId === ROLES.AUTHOR) {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden: Authors only' });
}

function optional(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = {
                ...decoded,
                roleId: decoded.role,
                roleName: ROLE_NAMES[decoded.role] || 'unknown',
            };
        }
    }
    next();
}

// Role-based middleware factory
function roleAuth(roles = []) {
    return function (req, res, next) {
        authMiddleware(req, res, function () {
            if (!roles.length || (req.user && roles.includes(req.user.roleName))) {
                return next();
            }
            return res.status(403).json({ error: 'Forbidden: Insufficient role' });
        });
    };
}

// Middleware to allow only admin or author
function authorOrAdminOnly(req, res, next) {
    if (req.user && (req.user.roleId === 2 || req.user.roleId === 3)) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden: Admin or Author only' });
}

module.exports = Object.assign(authMiddleware, { adminOnly, authorOnly, optional, roleAuth, authorOrAdminOnly });
