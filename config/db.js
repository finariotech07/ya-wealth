const knex = require('knex');
require('dotenv').config();

const dbClient = process.env.DB_CLIENT || 'sqlite3';

const config = {
    client: dbClient,
    connection: {},
    useNullAsDefault: true // for sqlite
};

if (dbClient === 'pg') {
    config.connection = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true'
    };
    config.useNullAsDefault = false;
} else if (dbClient === 'mysql' || dbClient === 'mysql2') {
    config.connection = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };
    config.useNullAsDefault = false;
} else if (dbClient === 'sqlite3') {
    config.connection = {
        filename: process.env.DB_FILE || './dev.sqlite3'
    };
}

const db = knex(config);

module.exports = db; 