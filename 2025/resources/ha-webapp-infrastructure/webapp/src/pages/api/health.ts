import { NextApiRequest, NextApiResponse } from 'next';
import redisClient from '../../lib/redis';
import pool from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: 'healthy',
    server: process.env.APP_NAME,
    timestamp: new Date().toISOString(),
    checks: {
      redis: false,
      mysql: false,
    },
  };

  try {
    await redisClient.ping();
    health.checks.redis = true;
  } catch (error) {
    health.status = 'degraded';
    console.error('Redis health check failed:', error);
  }

  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    health.checks.mysql = true;
  } catch (error) {
    health.status = 'degraded';
    console.error('MySQL health check failed:', error);
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
}