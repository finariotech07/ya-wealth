const db = require('../config/db');

// Create blog
async function createBlog(blogData, authorId) {
    // Remove published_at and author from input data and set them automatically
    const { published_at, author, ...dataToInsert } = blogData;
    const dataWithTimestamp = {
        ...dataToInsert,
        author_id: authorId,
        published_at: new Date().toISOString()
    };
    const [id] = await db('blogs').insert(dataWithTimestamp);
    return { id };
}

// Get all blogs with author names (optionally filter by status or category)
async function getAllBlogs(filters = {}) {
    let query = db('blogs')
        .select('blogs.*', 'users.fname', 'users.lname')
        .leftJoin('users', 'blogs.author_id', 'users.id');

    for (const [field, value] of Object.entries(filters)) {
        if (field === 'author_id') {
            query = query.where('blogs.author_id', value);
        } else {
            query = query.where(`blogs.${field}`, value);
        }
    }
    return await query;
}

// Get blog by ID with author name
async function getBlogById(id) {
    return await db('blogs')
        .select('blogs.*', 'users.fname', 'users.lname')
        .leftJoin('users', 'blogs.author_id', 'users.id')
        .where('blogs.id', id)
        .first();
}

// Get blog by slug with author name
async function getBlogBySlug(slug) {
    return await db('blogs')
        .select('blogs.*', 'users.fname', 'users.lname')
        .leftJoin('users', 'blogs.author_id', 'users.id')
        .where('blogs.slug', slug)
        .first();
}

// Update blog by ID
async function updateBlogById(id, updateData) {
    // Remove published_at and author from input data and set published_at automatically
    const { published_at, author, ...dataToUpdate } = updateData;
    const dataWithTimestamp = {
        ...dataToUpdate,
        published_at: new Date().toISOString()
    };
    const affectedRows = await db('blogs').where({ id }).update(dataWithTimestamp);
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
    getBlogBySlug,
    updateBlogById,
    deleteBlogById
}; 