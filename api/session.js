import { kv } from '@vercel/kv';
import crypto from 'crypto';

// Security: Rate limiting and validation
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_IP = 10;
const MAX_DURATION = 86400; // 24 hours in seconds

export default async function handler(req, res) {
    // Security: Strict CORS - only allow your domain
    const allowedOrigins = [
        'https://wwh-jmnarr08j-john-veroneaus-projects.vercel.app',
        'https://wwwwwh.io',
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    ].filter(Boolean);
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Security: Rate limiting by IP
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                        req.headers['x-real-ip'] || 
                        'unknown';
        
        const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex');
        const rateLimitKey = `ratelimit:${ipHash}`;
        
        const requestCount = await kv.incr(rateLimitKey);
        
        if (requestCount === 1) {
            await kv.expire(rateLimitKey, Math.ceil(RATE_LIMIT_WINDOW / 1000));
        }
        
        if (requestCount > MAX_REQUESTS_PER_IP) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        
        // Security: Input validation
        const { duration, timestamp } = req.body;
        
        if (typeof duration !== 'number' || duration < 0 || duration > MAX_DURATION) {
            return res.status(400).json({ error: 'Invalid duration' });
        }
        
        if (timestamp && (typeof timestamp !== 'number' || timestamp > Date.now())) {
            return res.status(400).json({ error: 'Invalid timestamp' });
        }
        
        // Store session data securely
        const sessionId = crypto.randomUUID();
        const sessionData = {
            duration: parseFloat(duration.toFixed(2)),
            timestamp: timestamp || Date.now(),
            userAgent: req.headers['user-agent']?.substring(0, 200), // Truncate
            recorded: new Date().toISOString()
        };
        
        // Store in KV with TTL (30 days)
        await kv.setex(`session:${sessionId}`, 2592000, JSON.stringify(sessionData));
        
        // Add to sessions list for aggregation
        await kv.lpush('sessions:list', sessionId);
        await kv.ltrim('sessions:list', 0, 9999); // Keep last 10k sessions
        
        // Update rolling statistics
        await updateStats(duration);
        
        return res.status(200).json({ 
            success: true,
            id: sessionId
        });
        
    } catch (error) {
        console.error('Session tracking error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateStats(duration) {
    try {
        // Increment total count
        await kv.incr('stats:total');
        
        // Update sum for average calculation
        await kv.incrbyfloat('stats:sum', duration);
        
        // Store daily stats
        const today = new Date().toISOString().split('T')[0];
        await kv.incr(`stats:daily:${today}`);
        await kv.expire(`stats:daily:${today}`, 7776000); // 90 days
        
    } catch (error) {
        console.error('Stats update error:', error);
    }
}
