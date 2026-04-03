// GoHighLevel (GHL) Integration Configuration
// Replace the placeholder URL with your actual GHL Webhook URL

// GHL Webhook URL - Update this with your actual webhook URL from GoHighLevel
const GHL_WEBHOOK_URL = import.meta.env.VITE_GHL_WEBHOOK_URL || '';

// Tags for different form types
export const GHL_TAGS = {
  CONTACT_FORM: 'web-contact',
  NEWSLETTER: 'web-newsletter',
};

interface GHLContactData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  tags?: string[];
  source?: string;
}

/**
 * Check if GHL is configured
 */
export function isGHLConfigured(): boolean {
  return !!GHL_WEBHOOK_URL && GHL_WEBHOOK_URL.length > 0;
}

/**
 * Submit contact data to GHL webhook
 */
export async function submitToGHL(data: GHLContactData): Promise<boolean> {
  if (!isGHLConfigured()) {
    console.warn('GHL webhook URL not configured. Set VITE_GHL_WEBHOOK_URL in your environment variables.');
    return false;
  }

  try {
    // Parse name into first and last name if full name provided
    let firstName = data.firstName || '';
    let lastName = data.lastName || '';

    if (data.name && !firstName && !lastName) {
      const nameParts = data.name.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    const payload = {
      firstName,
      lastName,
      email: data.email,
      phone: data.phone || '',
      tags: data.tags || [],
      source: data.source || 'Captaloona Web',
      customField: {
        message: data.message || '',
      },
    };

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('GHL webhook error:', response.status, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error submitting to GHL:', error);
    return false;
  }
}

/**
 * Submit contact form to GHL
 */
export async function submitContactToGHL(
  name: string,
  email: string,
  message: string
): Promise<boolean> {
  return submitToGHL({
    name,
    email,
    message,
    tags: [GHL_TAGS.CONTACT_FORM],
    source: 'Captaloona Web - Contact Form',
  });
}

/**
 * Submit newsletter subscription to GHL via Netlify serverless function.
 * The function calls the GHL API server-side using GHL_API_KEY + GHL_LOCATION_ID
 * env vars configured in the Netlify dashboard (not exposed to the browser).
 */
export async function submitNewsletterToGHL(email: string, name?: string): Promise<boolean> {
  try {
    const response = await fetch('/.netlify/functions/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error calling newsletter function:', error);
    return false;
  }
}
