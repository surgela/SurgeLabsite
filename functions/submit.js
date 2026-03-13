export async function onRequestPost(context) {
  const { request, env } = context;

  // Only accept JSON
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { name, email, subject, html } = body;

  // Basic validation
  if (!name || !email || !subject || !html) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }
  // Limit field lengths to prevent abuse
  if (name.length > 200 || email.length > 200 || subject.length > 500 || html.length > 10000) {
    return new Response(JSON.stringify({ error: 'Fields too long' }), { status: 400 });
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': env.BREVO_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Surge Lab Website', email: 'joe@surgelab.co.uk' },
      to: [{ email: 'info@surgelab.co.uk', name: 'Surge Lab' }],
      replyTo: { email: email, name: name },
      subject: subject,
      htmlContent: html,
    }),
  });

  if (res.ok) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 502 });
  }
}
