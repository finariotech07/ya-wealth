const db = require('../config/db');

// Create advisory signal
async function createSignal(data) {
    const [id] = await db('advisory_signals').insert(data);
    return { id };
}

// Get all signals (optionally filter by status or asset, with sorting)
async function getAllSignals(filters = {}, sortBy = null, sortOrder = 'asc') {
    let query = db('advisory_signals').select('*');
    for (const [field, value] of Object.entries(filters)) {
        query = query.where(field, value);
    }
    if (sortBy && ['asset', 'action', 'status'].includes(sortBy)) {
        query = query.orderBy(sortBy, sortOrder);
    } else {
        query = query.orderBy('created_at', 'desc');
    }
    return await query;
}

// Get signal by ID
async function getSignalById(id) {
    return await db('advisory_signals').where({ id }).first();
}

// Update signal by ID
async function updateSignalById(id, updateData) {
    const affectedRows = await db('advisory_signals').where({ id }).update(updateData);
    return affectedRows > 0;
}

// Delete signal by ID
async function deleteSignalById(id) {
    const affectedRows = await db('advisory_signals').where({ id }).del();
    return affectedRows > 0;
}

// Count distinct asset types
async function countDistinctAssets() {
    const result = await db('advisory_signals').countDistinct('asset as count');
    return result[0].count;
}

module.exports = {
    createSignal,
    getAllSignals,
    getSignalById,
    updateSignalById,
    deleteSignalById,
    countDistinctAssets
}; 