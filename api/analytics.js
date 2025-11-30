import { createClient } from 'redis';

// Create Redis client (singleton pattern)
let redis = null;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    redis.on('error', (err) => console.error('Redis Client Error:', err));
    
    await redis.connect();
    console.log('✅ Redis connected');
  }
  return redis;
}

export default async function handler(request) {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    const client = await getRedisClient();
    const { method } = request;
    const url = new URL(request.url);

    // POST /api/analytics - Track section access
    if (method === 'POST') {
      const body = await request.json();
      const { sectionName, sectionId, timeSpent } = body;

      if (!sectionName) {
        return new Response(
          JSON.stringify({ error: 'sectionName is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Increment access count
      await client.hIncrBy('section:counts', sectionName, 1);

      // Add time spent (if provided)
      if (timeSpent && timeSpent > 0) {
        await client.hIncrBy('section:times', sectionName, Math.floor(timeSpent));
      }

      // Update last accessed timestamp
      await client.hSet('section:lastAccessed', sectionName, new Date().toISOString());

      // Update section ID mapping
      if (sectionId) {
        await client.hSet('section:ids', sectionName, sectionId.toString());
      }

      return new Response(
        JSON.stringify({ success: true, section: sectionName }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // GET /api/analytics - Get all stats
    if (method === 'GET') {
      const action = url.searchParams.get('action');

      // Get stats for a specific section
      if (action === 'section') {
        const sectionName = url.searchParams.get('name');
        if (!sectionName) {
          return new Response(
            JSON.stringify({ error: 'section name is required' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const count = await client.hGet('section:counts', sectionName) || '0';
        const time = await client.hGet('section:times', sectionName) || '0';
        const lastAccessed = await client.hGet('section:lastAccessed', sectionName);

        return new Response(
          JSON.stringify({
            name: sectionName,
            accessCount: parseInt(count),
            totalTimeSpent: parseInt(time),
            lastAccessed: lastAccessed,
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get all stats
      const counts = await client.hGetAll('section:counts') || {};
      const times = await client.hGetAll('section:times') || {};
      const lastAccessed = await client.hGetAll('section:lastAccessed') || {};
      const ids = await client.hGetAll('section:ids') || {};

      // Combine into single stats object
      const stats = {};
      for (const [section, count] of Object.entries(counts)) {
        stats[section] = {
          name: section,
          id: ids[section] ? parseInt(ids[section]) : null,
          accessCount: parseInt(count) || 0,
          totalTimeSpent: parseInt(times[section]) || 0,
          lastAccessed: lastAccessed[section] || null,
        };
      }

      return new Response(
        JSON.stringify({
          sections: Object.values(stats),
          totalSections: Object.keys(stats).length,
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Analytics API error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
