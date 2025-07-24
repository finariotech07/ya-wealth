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

const contactSchema = z.object({
    username: z.string().min(1),
    email: z.string().email(),
    number: z.string().optional(),
    message: z.string().min(1)
});

module.exports = {
    validateContactSubmission: validate(contactSchema)
}; 