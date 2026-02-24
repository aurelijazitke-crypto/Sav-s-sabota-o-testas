export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    const { email, archetype } = req.body;

    if (!email) {
      return res.status(400).json({ ok: false, message: 'Email required' });
    }

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email,
        fields: {
          archetype: archetype || ''
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ ok: false, error: data });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
