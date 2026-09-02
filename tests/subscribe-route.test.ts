import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { POST } from "../src/app/api/subscribe/route.ts";

const originalFetch = globalThis.fetch;
const originalConsoleError = console.error;

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: "Bandymas",
    email: "qa@example.com",
    consent: true,
    website: "",
    startedAt: Date.now() - 5_000,
    primaryId: "kelios-strategijos",
    level: "ryšku",
    ...overrides
  };
}

function requestFor(
  body: unknown,
  origin = "https://testas.example"
): Request {
  return new Request("https://testas.example/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin
    },
    body: JSON.stringify(body)
  });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  console.error = originalConsoleError;
  delete process.env.MAILERLITE_API_TOKEN;
  delete process.env.MAILERLITE_API_KEY;
  delete process.env.MAILERLITE_GROUP_ID;
});

test("subscribe route rejects cross-origin requests", async () => {
  const response = await POST(
    requestFor(validBody(), "https://unrelated.example")
  );
  assert.equal(response.status, 403);
});

test("subscribe route rejects non-object JSON without throwing", async () => {
  const response = await POST(requestFor(null));
  assert.equal(response.status, 400);
});

test("subscribe route checks the actual body size", async () => {
  const response = await POST(requestFor({ padding: "x".repeat(12_500) }));
  assert.equal(response.status, 413);
});

test("subscribe route requires explicit consent", async () => {
  const response = await POST(requestFor(validBody({ consent: false })));
  assert.equal(response.status, 400);
});

test("subscribe route stays disabled without MailerLite secrets", async () => {
  const response = await POST(requestFor(validBody()));
  assert.equal(response.status, 503);
});

test("subscribe route maps MailerLite rate limits", async () => {
  process.env.MAILERLITE_API_TOKEN = "test-token";
  process.env.MAILERLITE_GROUP_ID = "test-group";
  globalThis.fetch = async () => new Response(null, { status: 429 });

  const response = await POST(requestFor(validBody()));
  assert.equal(response.status, 429);
});

test("subscribe route handles MailerLite failures without leaking details", async () => {
  process.env.MAILERLITE_API_TOKEN = "test-token";
  process.env.MAILERLITE_GROUP_ID = "test-group";
  globalThis.fetch = async () => new Response(null, { status: 500 });
  console.error = () => undefined;

  const response = await POST(requestFor(validBody()));
  const payload = (await response.json()) as { message: string };
  assert.equal(response.status, 502);
  assert.match(payload.message, /Laiško užsakyti nepavyko/);
});

test("subscribe route handles upstream network and timeout errors", async () => {
  process.env.MAILERLITE_API_TOKEN = "test-token";
  process.env.MAILERLITE_GROUP_ID = "test-group";
  globalThis.fetch = async () => {
    throw new DOMException("Timed out", "TimeoutError");
  };

  const response = await POST(requestFor(validBody()));
  assert.equal(response.status, 502);
});
