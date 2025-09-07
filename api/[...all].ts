import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set up serverless environment variables
  process.env.NODE_ENV = 'production';
  process.env.VERCEL = '1';

  try {
    // Dynamic import to handle module resolution in serverless environment
    const { default: app } = await import('../backend/dist/index.js');
    
    // Handle the request with Express app
    return new Promise((resolve, reject) => {
      app(req, res);
      res.on('finish', resolve);
      res.on('close', resolve);
      res.on('error', reject);
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Serverless function failed to process request'
    });
  }
}