// Netlify Function: Puja válida → GHL Inbound Webhook
// Se llama SOLO después de que place_bid() (RPC de Supabase) ya confirmó la
// oferta — así GHL nunca recibe pujas rechazadas por monto insuficiente o
// subasta cerrada. POSTea al mismo webhook entrante que usa newsletter.ts,
// con tag 'puja-online' y el monto/obra como custom fields.
//
// Required env var in Netlify dashboard:
//   GHL_WEBHOOK_URL → Inbound Webhook URL de la automatización de GHL

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
  let phone = '';
  let amount = 0;
  let artworkTitle = '';
  let auctionId = '';

  try {
    const body = JSON.parse(event.body || '{}');
    email = (body.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }
    const nameParts = (body.name || '').trim().split(/\s+/);
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
    phone = (body.phone || '').trim();
    amount = Number(body.amount) || 0;
    artworkTitle = (body.artworkTitle || '').trim();
    auctionId = (body.auctionId || '').trim();
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('GHL_WEBHOOK_URL not configured — skipping GHL notification for bid');
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, source: 'skipped' }) };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        phone,
        tags: ['puja-online'],
        customField: {
          offerAmount: amount,
          artwork: artworkTitle,
          auctionId,
        },
      }),
    });

    const responseText = await response.text();
    console.log('GHL webhook response (bid):', response.status, responseText.slice(0, 200));

    if (!response.ok) {
      console.error('GHL webhook error (bid):', response.status, responseText);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'GHL webhook error' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('bid-notify function error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
