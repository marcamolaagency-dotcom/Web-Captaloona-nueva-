// Netlify Function: Newsletter subscription → GHL Inbound Webhook
// POSTs contact data to a GHL automation webhook that creates the contact
// and adds the 'newsletter' tag — no API key needed.
//
// Required env var in Netlify dashboard:
//   GHL_WEBHOOK_URL → Inbound Webhook URL from the GHL automation workflow
//                     (Settings → Automatizaciones → Webhook Entrante → URL)

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

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('GHL_WEBHOOK_URL not configured — skipping GHL, Netlify Forms is backup');
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, source: 'backup' }) };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName, lastName, tags: ['newsletter'] }),
    });

    const responseText = await response.text();
    console.log('GHL webhook response:', response.status, responseText.slice(0, 200));

    if (!response.ok) {
      console.error('GHL webhook error:', response.status, responseText);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'GHL webhook error' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Newsletter function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
