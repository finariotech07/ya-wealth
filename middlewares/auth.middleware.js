const { verifyToken } = require('../services/jwt.service');
const { ROLES, ROLE_NAMES } = require('../constants/roles');

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

function editorOnly(req, res, next) {
    if (req.user && req.user.roleId === ROLES.EDITOR) {
        return next();
    }
    return res.status(403).json({ error: 'Forbidden: Editors only' });
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

module.exports = Object.assign(authMiddleware, { adminOnly, editorOnly, optional, roleAuth });
