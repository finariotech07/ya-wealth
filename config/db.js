const knex = require('knex');
require('dotenv').config();

// Force use of mysql2 as the client
const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'test'
    }
});

module.exports = db; 