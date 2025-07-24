const { z } = require('zod');

function validate(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err) {
            const message = err.errors?.[0]?.message || 'Invalid request data';
            return res.status(422).json({ success: false, message });
        }
    };
}

const blogSchema = z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    author: z.string().optional(),
    image_url: z.string().optional(),
    category: z.string().optional(),
    published_at: z.string().datetime().optional(),
    status: z.string().optional()
});

const blogUpdateSchema = blogSchema.partial();

module.exports = {
    validateCreateBlog: validate(blogSchema),
    validateUpdateBlog: validate(blogUpdateSchema)
}; 