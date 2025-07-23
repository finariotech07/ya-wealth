const db = require('../config/db');

const SAFE_FIELDS = [
    'id',
    'email',
    'fname',
    'lname',
    'phone',
    'role_id',
    'is_verified',
    'auth_provider',
    'created_at',
    'updated_at'
];

// Create a new user
async function createUser(userData) {
    const [id] = await db('users').insert(userData);
    return { id };
}

// Find user by email
async function findUserByEmail(email) {
    const user = await db('users')
        .select(SAFE_FIELDS)
        .where({ email })
        .first();
    return user || null;
}

// Find user by ID
async function findUserById(id) {
    const user = await db('users')
        .select(SAFE_FIELDS)
        .where({ id })
        .first();
    return user || null;
}

// Generic update
async function updateUserById(id, updateData) {
    const affectedRows = await db('users')
        .where({ id })
        .update(updateData);
    return affectedRows > 0;
}

// Check existence
async function userExistsByEmailOrPhone(email, phone) {
    const user = await db('users')
        .select('id')
        .where(function () {
            this.where('email', email).orWhere('phone', phone);
        })
        .first();
    return !!user;
}

// Search users
async function searchUsers(filters = {}) {
    let query = db('users').select(SAFE_FIELDS);
    for (const [field, value] of Object.entries(filters)) {
        query = query.where(field, value);
    }
    const users = await query;
    return users;
}

// Delete user
async function deleteUserById(id) {
    const affectedRows = await db('users')
        .where({ id })
        .del();
    return affectedRows > 0;
}

async function returnPassword(email) {
    const user = await db('users')
        .select([...SAFE_FIELDS, 'password'])
        .where({ email })
        .first();
    return user || null;
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserById,
    userExistsByEmailOrPhone,
    searchUsers,
    deleteUserById,
    returnPassword
};
