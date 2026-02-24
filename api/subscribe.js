export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { email, archetype } = req.body || {};

    if (!email) {
      return res.status(400).json({ ok: false, message: "Email required" });
    }

    const map = {
      PERFECTIONIST: process.env.GROUP_PERFECTIONIST,
      PROCRASTINATOR: process.env.GROUP_PROCRASTINATOR,
      CRITIC: process.env.GROUP_CRITIC,
      PLEASER: process.env.GROUP_PLEASER,
    };

    const groupId = map[archetype];

    if (!process.env.MAILERLITE_API_KEY) {
      return res.status(500).json({ ok: false, message: "Missing MAILERLITE_API_KEY" });
    }

    if (!groupId) {
      return res.status(400).json({
        ok: false,
        message: `Unknown archetype or missing group env var for: ${archetype}`,
      });
    }

    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        groups: [groupId],
        fields: {
          archetype: archetype || "",
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: data });
    }

    return res.status(200).json({ ok: true, data });
  } catch (e) {
    return res.status(500).json({ ok: false, message: "Server error", error: String(e) });
  }
}
