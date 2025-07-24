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

const newsSchema = z.object({
    type: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    source: z.string().optional(),
    link: z.string().optional(),
    timestamp: z.string().datetime().optional(),
    status: z.string().optional(),
    image_url: z.string().optional()
});

const newsUpdateSchema = newsSchema.partial();

module.exports = {
    validateCreateNews: validate(newsSchema),
    validateUpdateNews: validate(newsUpdateSchema)
}; 