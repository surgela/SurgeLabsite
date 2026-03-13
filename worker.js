export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle form submissions
    if (url.pathname === '/submit' && request.method === 'POST') {
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

      if (!name || !email || !subject || !html) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }
      if (typeof email !== 'string' || !email.includes('@')) {
        return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
      }
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

    // All other requests served as static assets
    return env.ASSETS.fetch(request);
  }
};
