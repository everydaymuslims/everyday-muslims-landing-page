import { normaliseEmail, saveSubscription } from "../../../lib/newsletter.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  const acceptsJson = request.headers.get("accept")?.includes("application/json");
  const reply = (status, code) => {
    const headers = { "Cache-Control": "no-store" };
    if (acceptsJson) return Response.json({ status }, { status: code, headers });
    return new Response(null, {
      status: 303,
      headers: { ...headers, Location: `/?signup=${status}#newsletter` },
    });
  };

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (request.headers.get("sec-fetch-site") === "cross-site" ||
      (origin && ![ `http://${host}`, `https://${host}` ].includes(origin))) {
    return reply("error", 403);
  }

  let data;
  try {
    data = await request.formData();
  } catch {
    return reply("invalid", 400);
  }

  const email = normaliseEmail(data.get("email"));
  if (!email) return reply("invalid", 400);

  try {
    saveSubscription(email);
    return reply("success", 200);
  } catch (error) {
    console.error("Newsletter storage failed.", error.code ?? error.name);
    return reply("error", 503);
  }
}
