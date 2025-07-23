const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // default 1 day

function signToken(payload, expiresIn = JWT_EXPIRES_IN) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}

function decodeToken(token) {
    try {
        return jwt.decode(token);
    } catch (err) {
        return null;
    }
}

module.exports = {
    signToken,
    verifyToken,
    decodeToken
};
