require('dotenv').config();

const usarSsl = process.env.DB_SSL === 'true';

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hub_eventos',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    dialectOptions: usarSsl
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  },
};
