// Netlify Function: Newsletter subscription → GHL API
// Creates a contact in GoHighLevel with the 'newsletter' tag.
//
// Required env vars in Netlify dashboard (NOT prefixed with VITE_):
//   GHL_API_KEY      → Location-level Private Integration token (pit-...)
//   GHL_LOCATION_ID  → GHL Location ID (from the URL: /v2/location/{ID}/...)

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
    console.warn('GHL not configured: GHL_API_KEY missing');
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, source: 'backup' }) };
  }

  const authHeaders = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Version': GHL_API_VERSION,
  };

  try {
    // Location-level PIT already carries the location context implicitly.
    // Do NOT include locationId in the body — that causes a 403 with location tokens.
    const contactPayload: any = {
      email,
      tags: ['newsletter'],
      source: 'Captaloona Web',
    };
    if (firstName) contactPayload.firstName = firstName;
    if (lastName) contactPayload.lastName = lastName;

    console.log('Creating GHL contact for:', email);

    const response = await fetch(GHL_CONTACTS_URL, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(contactPayload),
    });

    const responseText = await response.text();
    console.log('GHL response:', response.status, responseText.slice(0, 300));

    // Contact created successfully
    if (response.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // Contact already exists — search by email and add tag
    if (response.status === 422) {
      const searchRes = await fetch(
        `https://services.leadconnectorhq.com/contacts/search/duplicate?email=${encodeURIComponent(email)}`,
        { headers: authHeaders }
      );

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const contactId = searchData?.contact?.id;
        if (contactId) {
          await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ tags: ['newsletter'] }),
          });
        }
      }
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // Any other error
    console.error('GHL API error:', response.status, responseText);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GHL API error', status: response.status, detail: responseText }) };

  } catch (err) {
    console.error('Newsletter function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
