import { NextApiRequest, NextApiResponse } from 'next';
import redisClient from '../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionId = req.headers.cookie?.split('sessionId=')[1]?.split(';')[0] || 
                    `session_${Date.now()}_${Math.random().toString(36)}`;
  
  if (req.method === 'GET') {
    try {
      const sessionData = await redisClient.get(sessionId);
      const data = sessionData ? JSON.parse(sessionData) : {};
      
      res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
      res.status(200).json({
        sessionId,
        data,
        server: process.env.APP_NAME,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve session' });
    }
  } else if (req.method === 'POST') {
    try {
      const data = req.body;
      await redisClient.setEx(sessionId, 3600, JSON.stringify(data));
      
      res.setHeader('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
      res.status(200).json({
        message: 'Session saved',
        sessionId,
        server: process.env.APP_NAME,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save session' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}