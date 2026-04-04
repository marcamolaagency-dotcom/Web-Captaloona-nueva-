// Netlify Function: Newsletter subscription → GHL API v1
// Uses GHL's v1 REST API which works with location-level API keys.
//
// Required env vars in Netlify dashboard:
//   GHL_API_KEY  → Location API key from GHL: Settings → Claves de API

export const handler = async (event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let email: string;
  let firstName = '';
  let lastName = '';
  try {
    const body = JSON.parse(event.body || '{}');
    email = (body.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }
    const nameParts = (body.name || '').trim().split(/\s+/);
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const apiKey = process.env.GHL_API_KEY;

  if (!apiKey) {
    console.warn('GHL_API_KEY not configured — skipping GHL, Netlify Forms is backup');
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, source: 'backup' }) };
  }

  try {
    // GHL API v1 — location-scoped key, no locationId needed in body
    const response = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        tags: ['newsletter'],
        source: 'Captaloona Web',
      }),
    });

    const responseText = await response.text();
    console.log('GHL v1 response:', response.status, responseText.slice(0, 300));

    if (!response.ok) {
      console.error('GHL API v1 error:', response.status, responseText);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'GHL error', status: response.status }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Newsletter function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
