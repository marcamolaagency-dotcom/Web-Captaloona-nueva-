// Netlify Function: Newsletter subscription → GHL API
// Creates/updates a contact in GoHighLevel and adds the 'newsletter' tag
//
// Required env vars in Netlify dashboard (NOT prefixed with VITE_):
//   GHL_API_KEY      → GHL Private Integration token
//                      (Settings → Integrations → API Keys → Private Integration Token)
//   GHL_LOCATION_ID  → GHL Location/Sub-account ID
//                      (Settings → Business Profile → Location ID)

const GHL_CONTACTS_URL = 'https://services.leadconnectorhq.com/contacts/';
const GHL_API_VERSION = '2021-07-28';

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

  // Parse request body
  let email: string;
  try {
    const body = JSON.parse(event.body || '{}');
    email = (body.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  // If GHL is not configured, succeed silently (Netlify Forms is the backup)
  if (!apiKey || !locationId) {
    console.warn('GHL not configured: GHL_API_KEY or GHL_LOCATION_ID missing');
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, source: 'backup' }) };
  }

  try {
    const response = await fetch(GHL_CONTACTS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': GHL_API_VERSION,
      },
      body: JSON.stringify({
        email,
        locationId,
        tags: ['newsletter'],
        source: 'Captaloona Web',
      }),
    });

    const responseText = await response.text();

    // 422 typically means the contact already exists — still a success for our purposes
    if (!response.ok && response.status !== 422) {
      console.error('GHL API error:', response.status, responseText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'GHL API error', status: response.status }),
      };
    }

    // If contact already exists (422), add the newsletter tag via update
    if (response.status === 422) {
      const searchRes = await fetch(
        `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email)}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Version': GHL_API_VERSION,
          },
        }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const contactId = searchData?.contact?.id;

        if (contactId) {
          await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'Version': GHL_API_VERSION,
            },
            body: JSON.stringify({ tags: ['newsletter'] }),
          });
        }
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Newsletter function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
