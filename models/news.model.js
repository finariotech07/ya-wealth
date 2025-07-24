const db = require('../config/db');

// Create news
async function createNews(newsData) {
    const [id] = await db('news').insert(newsData);
    return { id };
}

// Get all news (optionally filter by type or status)
async function getAllNews(filters = {}) {
    let query = db('news').select('*');
    for (const [field, value] of Object.entries(filters)) {
        query = query.where(field, value);
    }
    return await query;
}

// Update news by ID
async function updateNewsById(id, updateData) {
    const affectedRows = await db('news').where({ id }).update(updateData);
    return affectedRows > 0;
}

// Delete news by ID
async function deleteNewsById(id) {
    const affectedRows = await db('news').where({ id }).del();
    return affectedRows > 0;
}

module.exports = {
    createNews,
    getAllNews,
    updateNewsById,
    deleteNewsById
}; 