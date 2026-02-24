export default async function handler(req, res) {
  // Leiskim tik POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { email, archetype } = req.body || {};

    if (!email) {
      return res.status(400).json({ ok: false, message: "Email required" });
    }

    // Susimappinam archetype -> Vercel env group ID
    const map = {
      PERFECTIONIST: process.env.GROUP_PERFECTIONIST,
      CRITIC: process.env.GROUP_CRITIC,
      PROCRASTINATOR: process.env.GROUP_PROCRASTINATOR,
      PLEASER: process.env.GROUP_PLEASER,
    };

    const groupId = map[String(archetype || "").toUpperCase()];

    if (!process.env.MAILERLITE_API_KEY) {
      return res.status(500).json({ ok: false, message: "Missing MAILERLITE_API_KEY in env" });
    }

    if (!groupId) {
      return res.status(400).json({
        ok: false,
        message: "Unknown archetype or missing GROUP_* env var for it",
        archetype,
      });
    }

    // 1) Sukuriam / upsertinam subscriberį
    const createResp = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          archetype: archetype || "",
        },
      }),
    });

    const createData = await createResp.json();

    if (!createResp.ok) {
      return res.status(createResp.status).json({ ok: false, step: "create_subscriber", error: createData });
    }

    // 2) Pridedam subscriberį į grupę (tai ir yra trigeris tavo automationui)
    const addToGroupResp = await fetch(`https://connect.mailerlite.com/api/groups/${groupId}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({ email }),
    });

    const addToGroupData = await addToGroupResp.json();

    if (!addToGroupResp.ok) {
      return res.status(addToGroupResp.status).json({
        ok: false,
        step: "add_to_group",
        groupId,
        error: addToGroupData,
      });
    }

    return res.status(200).json({ ok: true, groupId });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error", error: String(err) });
  }
}
