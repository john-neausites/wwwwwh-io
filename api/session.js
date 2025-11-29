// Vercel Serverless Function to track session durations
// SQLite database stored in /tmp (ephemeral) or use Vercel KV for persistence

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { duration, timestamp } = req.body;
        
        if (typeof duration !== 'number' || duration < 0) {
            return res.status(400).json({ error: 'Invalid duration' });
        }
        
        // For now, log to Vercel logs (viewable via vercel logs)
        console.log(JSON.stringify({
            event: 'session_end',
            duration: duration,
            timestamp: timestamp || Date.now(),
            userAgent: req.headers['user-agent'],
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        }));
        
        // TODO: Store in Vercel KV, Postgres, or other database
        // Example with Vercel KV:
        // const { kv } = require('@vercel/kv');
        // await kv.rpush('sessions', { duration, timestamp });
        
        return res.status(200).json({ 
            success: true, 
            message: 'Session duration recorded'
        });
        
    } catch (error) {
        console.error('Session tracking error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
