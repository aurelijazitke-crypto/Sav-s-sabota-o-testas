import { QUIZ_VERSION } from "../../../lib/quiz-content.ts";
import {
  PROFILE_IDS,
  type PatternProfileId
} from "../../../lib/quiz-types.ts";
import { isResultProfileId } from "../../../lib/scoring.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_KEY_PATTERN = /^[a-zA-Z0-9_]{1,64}$/;
const MAX_BODY_BYTES = 12_000;
const MIN_COMPLETION_MS = 1_200;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;

type SubscribePayload = {
  name?: unknown;
  email?: unknown;
  consent?: unknown;
  website?: unknown;
  startedAt?: unknown;
  primaryId?: unknown;
  secondaryId?: unknown;
  level?: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isPatternProfileId(value: unknown): value is PatternProfileId {
  return (
    typeof value === "string" &&
    (PROFILE_IDS as readonly string[]).includes(value)
  );
}

function addConfiguredField(
  fields: Record<string, string>,
  envName: string,
  fallback: string,
  value: string
) {
  const key = process.env[envName] || fallback;
  if (FIELD_KEY_PATTERN.test(key) && value) {
    fields[key] = value;
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json(
      { ok: false, message: "Užklausa per didelė." },
      { status: 413 }
    );
  }

  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  const host = forwardedHost || request.headers.get("host");
  const protocol = forwardedProtocol || requestUrl.protocol.slice(0, -1);
  const allowedOrigins = new Set([requestUrl.origin]);
  if (host) allowedOrigins.add(protocol + "://" + host);

  if (origin && !allowedOrigins.has(origin)) {
    return Response.json(
      { ok: false, message: "Šios užklausos patvirtinti nepavyko." },
      { status: 403 }
    );
  }

  let body: SubscribePayload;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return Response.json(
        { ok: false, message: "Užklausa per didelė." },
        { status: 413 }
      );
    }

    const parsedBody: unknown = JSON.parse(rawBody);
    if (!isPlainObject(parsedBody)) throw new Error("Invalid payload");
    body = parsedBody;
  } catch {
    return Response.json(
      { ok: false, message: "Nepavyko perskaityti formos duomenų." },
      { status: 400 }
    );
  }

  if (cleanText(body.website, 120)) {
    return Response.json({
      ok: true,
      message: "Patikrink savo el. paštą."
    });
  }

  const startedAt =
    typeof body.startedAt === "number" ? body.startedAt : Number.NaN;
  const elapsed = Date.now() - startedAt;
  if (
    !Number.isFinite(startedAt) ||
    elapsed < MIN_COMPLETION_MS ||
    elapsed > MAX_FORM_AGE_MS
  ) {
    return Response.json(
      {
        ok: false,
        message: "Atnaujink puslapį ir pabandyk pateikti formą dar kartą."
      },
      { status: 400 }
    );
  }

  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 254).toLowerCase();
  const level = cleanText(body.level, 48);

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json(
      { ok: false, message: "Patikrink, ar teisingai įvedei el. paštą." },
      { status: 400 }
    );
  }

  if (body.consent !== true) {
    return Response.json(
      {
        ok: false,
        message: "Pažymėk sutikimą, jei nori gauti laiškus."
      },
      { status: 400 }
    );
  }

  if (!isResultProfileId(body.primaryId)) {
    return Response.json(
      { ok: false, message: "Testo rezultatas neatpažintas." },
      { status: 400 }
    );
  }

  if (
    body.secondaryId !== undefined &&
    body.secondaryId !== null &&
    body.secondaryId !== "" &&
    !isPatternProfileId(body.secondaryId)
  ) {
    return Response.json(
      { ok: false, message: "Antrinis testo rezultatas neatpažintas." },
      { status: 400 }
    );
  }

  const apiToken =
    process.env.MAILERLITE_API_TOKEN || process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiToken || !groupId) {
    return Response.json(
      {
        ok: false,
        message:
          "Bandomojoje versijoje el. laiškų siuntimas dar neįjungtas."
      },
      { status: 503 }
    );
  }

  const fields: Record<string, string> = {};
  if (name) fields.name = name;
  addConfiguredField(
    fields,
    "MAILERLITE_PRIMARY_FIELD",
    "gg_primary_type",
    body.primaryId
  );
  addConfiguredField(
    fields,
    "MAILERLITE_SECONDARY_FIELD",
    "gg_secondary_type",
    isPatternProfileId(body.secondaryId) ? body.secondaryId : ""
  );
  addConfiguredField(
    fields,
    "MAILERLITE_LEVEL_FIELD",
    "gg_level",
    level
  );
  addConfiguredField(
    fields,
    "MAILERLITE_VERSION_FIELD",
    "gg_test_version",
    QUIZ_VERSION
  );

  try {
    const mailerLiteResponse = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + apiToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          fields,
          groups: [groupId]
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(8_000)
      }
    );

    if (mailerLiteResponse.status === 429) {
      return Response.json(
        {
          ok: false,
          message:
            "Šiuo metu gauname daug užklausų. Pabandyk dar kartą po minutės."
        },
        { status: 429 }
      );
    }

    if (!mailerLiteResponse.ok) {
      console.error("MailerLite subscribe failed", {
        status: mailerLiteResponse.status
      });
      return Response.json(
        {
          ok: false,
          message:
            "Laiško užsakyti nepavyko. Pabandyk dar kartą arba parašyk Aurelijai."
        },
        { status: 502 }
      );
    }

    return Response.json({
      ok: true,
      message:
        "Patikrink savo el. paštą. Jei laiške prašoma, patvirtink prenumeratą."
    });
  } catch {
    return Response.json(
      {
        ok: false,
        message:
          "Ryšys trumpam sutriko. Pabandyk dar kartą po kelių akimirkų."
      },
      { status: 502 }
    );
  }
}
