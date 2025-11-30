import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method } = request;
    const url = new URL(request.url);

    // POST /api/analytics - Track section access
    if (method === 'POST') {
      const body = await request.json();
      const { sectionName, sectionId, timeSpent } = body;

      if (!sectionName) {
        return new Response(
          JSON.stringify({ error: 'sectionName is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Increment access count
      await kv.hincrby('section:counts', sectionName, 1);

      // Add time spent (if provided)
      if (timeSpent && timeSpent > 0) {
        await kv.hincrby('section:times', sectionName, timeSpent);
      }

      // Update last accessed timestamp
      await kv.hset('section:lastAccessed', { [sectionName]: new Date().toISOString() });

      // Update section ID mapping
      if (sectionId) {
        await kv.hset('section:ids', { [sectionName]: sectionId });
      }

      return new Response(
        JSON.stringify({ success: true, section: sectionName }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const count = await kv.hget('section:counts', sectionName) || 0;
        const time = await kv.hget('section:times', sectionName) || 0;
        const lastAccessed = await kv.hget('section:lastAccessed', sectionName);

        return new Response(
          JSON.stringify({
            name: sectionName,
            accessCount: count,
            totalTimeSpent: time,
            lastAccessed: lastAccessed,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get all stats
      const counts = await kv.hgetall('section:counts') || {};
      const times = await kv.hgetall('section:times') || {};
      const lastAccessed = await kv.hgetall('section:lastAccessed') || {};
      const ids = await kv.hgetall('section:ids') || {};

      // Combine into single stats object
      const stats = {};
      for (const [section, count] of Object.entries(counts)) {
        stats[section] = {
          name: section,
          id: ids[section] || null,
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
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Analytics API error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
