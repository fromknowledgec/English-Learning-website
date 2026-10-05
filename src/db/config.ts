import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// 数据库连接配置
const pool = new Pool({
  host: process.env.DATABASE_URL || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'english_learning',
  ssl: process.env.DATABASE_SSL === 'true',
});

// 创建数据库实例
export const db = drizzle(pool);
