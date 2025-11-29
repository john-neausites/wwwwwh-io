import { put } from '@vercel/blob';
import crypto from 'crypto';

// Security: NSKey verification required for all uploads
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_IP = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'application/json'];

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb'
        }
    }
};

export default async function handler(req, res) {
    // Security: Strict CORS
    const allowedOrigins = [
        'https://wwh-irtobi2iz-john-veroneaus-projects.vercel.app',
        'https://wwwwwh.io',
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    ].filter(Boolean);
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-NSKey-Token');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Security: Verify NSKey authentication
        const nskeyToken = req.headers['x-nskey-token'];
        
        if (!nskeyToken) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'NSKey authentication required'
            });
        }
        
        // Verify NSKey token (you'll implement this based on your NSKey system)
        const isValidNSKey = await verifyNSKey(nskeyToken);
        
        if (!isValidNSKey) {
            return res.status(403).json({ 
                error: 'Forbidden',
                message: 'Invalid NSKey token'
            });
        }
        
        // Security: Rate limiting
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
        const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex');
        const rateLimitKey = `upload:ratelimit:${ipHash}`;
        
        // Note: Would need KV for rate limiting, simplified for now
        
        // Security: Validate file
        const { filename, contentType, data } = req.body;
        
        if (!filename || !contentType || !data) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Validate content type
        if (!ALLOWED_TYPES.includes(contentType)) {
            return res.status(400).json({ 
                error: 'Invalid file type',
                allowed: ALLOWED_TYPES
            });
        }
        
        // Validate filename (no path traversal)
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        
        // Convert base64 to buffer
        let fileBuffer;
        try {
            fileBuffer = Buffer.from(data, 'base64');
        } catch (error) {
            return res.status(400).json({ error: 'Invalid file data' });
        }
        
        // Validate file size
        if (fileBuffer.length > MAX_FILE_SIZE) {
            return res.status(413).json({ 
                error: 'File too large',
                max_size: '10MB'
            });
        }
        
        // Generate secure path with timestamp and hash
        const timestamp = Date.now();
        const hash = crypto.createHash('sha256')
            .update(fileBuffer)
            .digest('hex')
            .substring(0, 8);
        
        const securePath = `uploads/${timestamp}-${hash}-${sanitizedFilename}`;
        
        // Upload to Vercel Blob with access control
        const blob = await put(securePath, fileBuffer, {
            access: 'public', // or 'private' depending on your needs
            contentType: contentType,
            addRandomSuffix: false
        });
        
        // Log successful upload
        console.log(JSON.stringify({
            event: 'file_uploaded',
            url: blob.url,
            size: fileBuffer.length,
            contentType: contentType,
            timestamp: new Date().toISOString()
        }));
        
        return res.status(200).json({
            success: true,
            url: blob.url,
            pathname: blob.pathname,
            size: fileBuffer.length
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Verify NSKey token - implement based on your authentication system
async function verifyNSKey(token) {
    // TODO: Implement your NSKey verification logic
    // This could involve:
    // - Checking against stored NSKey hashes in KV
    // - Verifying WebAuthn credentials
    // - Checking hardware key signatures
    
    // Placeholder - always returns false until you implement NSKey verification
    console.warn('NSKey verification not yet implemented');
    return false;
    
    // Example implementation:
    // const { kv } = require('@vercel/kv');
    // const storedHash = await kv.get(`nskey:${token}`);
    // return storedHash !== null;
}
