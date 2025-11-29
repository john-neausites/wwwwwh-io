import { kv } from '@vercel/kv';

// Security: Read-only stats endpoint with rate limiting
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 30;

export default async function handler(req, res) {
    // Security: CORS
    const allowedOrigins = [
        'https://wwh-jmnarr08j-john-veroneaus-projects.vercel.app',
        'https://wwwwwh.io',
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    ].filter(Boolean);
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Security: Rate limiting
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
        const rateLimitKey = `stats:ratelimit:${clientIp}`;
        
        const requestCount = await kv.incr(rateLimitKey);
        
        if (requestCount === 1) {
            await kv.expire(rateLimitKey, Math.ceil(RATE_LIMIT_WINDOW / 1000));
        }
        
        if (requestCount > MAX_REQUESTS) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        
        // Get aggregated stats
        const [total, sum] = await Promise.all([
            kv.get('stats:total'),
            kv.get('stats:sum')
        ]);
        
        const totalSessions = parseInt(total) || 0;
        const totalDuration = parseFloat(sum) || 0;
        const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
        
        // Get recent sessions count (last 10k)
        const recentCount = await kv.llen('sessions:list');
        
        return res.status(200).json({
            total_sessions: totalSessions,
            average_duration: parseFloat(averageDuration.toFixed(2)),
            recent_sessions: recentCount,
            unit: 'seconds'
        });
        
    } catch (error) {
        console.error('Stats retrieval error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
