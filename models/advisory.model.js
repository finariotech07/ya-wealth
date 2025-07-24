const db = require('../config/db');

// Create advisory signal
async function createSignal(data) {
    const [id] = await db('advisory_signals').insert(data);
    return { id };
}

// Get all signals (optionally filter by status or asset)
async function getAllSignals(filters = {}) {
    let query = db('advisory_signals').select('*');
    for (const [field, value] of Object.entries(filters)) {
        query = query.where(field, value);
    }
    return await query.orderBy('created_at', 'desc');
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

module.exports = {
    createSignal,
    getAllSignals,
    getSignalById,
    updateSignalById,
    deleteSignalById
}; 