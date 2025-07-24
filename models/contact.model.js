const db = require('../config/db');

// Create contact submission
async function createSubmission(data) {
    const [id] = await db('contact_submissions').insert(data);
    return { id };
}

// Get all submissions
async function getAllSubmissions() {
    return await db('contact_submissions').select('*').orderBy('submitted_at', 'desc');
}

// Get submission by ID
async function getSubmissionById(id) {
    return await db('contact_submissions').where({ id }).first();
}

// Delete submission by ID
async function deleteSubmissionById(id) {
    const affectedRows = await db('contact_submissions').where({ id }).del();
    return affectedRows > 0;
}

module.exports = {
    createSubmission,
    getAllSubmissions,
    getSubmissionById,
    deleteSubmissionById
}; 