import 'dotenv/config';
import { Sequelize } from 'sequelize';

const usarSsl = process.env.DB_SSL === 'true';

export const sequelize = new Sequelize(
  process.env.DB_NAME ?? 'hub_eventos',
  process.env.DB_USER ?? 'postgres',
  process.env.DB_PASSWORD ?? 'postgres',
  {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    dialect: 'postgres',
    logging: false,
    dialectOptions: usarSsl
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  },
);
