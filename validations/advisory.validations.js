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

const signalSchema = z.object({
    asset: z.string().min(1),
    action: z.enum(['BUY', 'SELL']),
    entry: z.string().or(z.number()),
    stop_loss: z.string().or(z.number()),
    target: z.string().or(z.number()),
    status: z.enum(['Active', 'Pending', 'Closed']),
    chart_url: z.string().url().optional()
});

const signalUpdateSchema = signalSchema.partial();

module.exports = {
    validateCreateSignal: validate(signalSchema),
    validateUpdateSignal: validate(signalUpdateSchema)
}; 