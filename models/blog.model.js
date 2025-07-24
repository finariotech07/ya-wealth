const db = require('../config/db');

// Create blog
async function createBlog(blogData) {
    const [id] = await db('blogs').insert(blogData);
    return { id };
}

// Get all blogs (optionally filter by status or category)
async function getAllBlogs(filters = {}) {
    let query = db('blogs').select('*');
    for (const [field, value] of Object.entries(filters)) {
        query = query.where(field, value);
    }
    return await query;
}

// Get blog by ID
async function getBlogById(id) {
    return await db('blogs').where({ id }).first();
}

// Update blog by ID
async function updateBlogById(id, updateData) {
    const affectedRows = await db('blogs').where({ id }).update(updateData);
    return affectedRows > 0;
}

// Delete blog by ID
async function deleteBlogById(id) {
    const affectedRows = await db('blogs').where({ id }).del();
    return affectedRows > 0;
}

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlogById,
    deleteBlogById
}; 