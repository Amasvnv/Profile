/**
 * Portfolio chat API.
 *
 * Holds the AI key on the server so the static site (GitHub Pages) never sees it.
 * The browser sends { messages: [{ role, content }, ...] } and gets { answer }.
 *
 * Required bindings
 *   FREEBUFF_API_KEY secret - API key, set with sites_set_secret (never in the repo)
 * Optional vars
 *   AI_BASE  - OpenAI-compatible base URL (default: https://freebuff.com/api/v1/paid)
 *   AI_MODEL - model id (default: deepseek-v4.1-flash)
 *
 * Contact form: POST /contact
 *   RESEND_KEY   - secret holding the Resend API key (sites_set_secret)
 *   CONTACT_TO   - optional recipient (default hongkham.svnv@outlook.com)
 *   CONTACT_FROM - optional verified sender (default Portfolio <onboarding@resend.dev>)
 */
import { KB } from "./kb.js";

const ALLOWED_ORIGINS = new Set([
  "https://amasvnv.github.io",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
]);

const DEFAULT_MODEL = "deepseek-v4.1-flash";

const MAX_TURNS = 10;
const MAX_CHARS = 800;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;

/* Best-effort per-isolate throttle: protects the owner's credits from a loop. */
const hits = new Map();

const SYSTEM = [
  "LANGUAGE RULE, highest priority: reply in the visitor's language. A Thai question gets a Thai answer written in Thai script, a Lao question gets Lao, an English question gets English. The knowledge base below is written in Lao; that is not the reply language, so translate the facts you use. Never answer a Thai question in Lao.",
  "You are the assistant on Hongkham Suvannavong's IT portfolio website.",
  "Keep answers short (2-4 sentences) and concrete. Never say you do not understand the question; if something is genuinely missing, say briefly what you do know and point to contact.",
  "When asked about experience or skills, summarise the roles and skill groups listed in the knowledge base (title, employer, years) instead of saying you are unsure.",
  "Use ONLY the facts in the knowledge base below. Never invent projects, dates, employers, prices or contact details.",
  "If the answer is not in the knowledge base, say you are not sure and point the visitor to the contact section (email hongkham.svnv@outlook.com or phone/WhatsApp +856 20 5885 5817).",
  "Refer to him in the third person; do not claim to be him.",
  "",
  "KNOWLEDGE BASE",
  KB,
].join("\n");

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "https://amasvnv.github.io";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function tooMany(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 500) {
      for (const [key, value] of hits) {
        if (now - value.start > WINDOW_MS) hits.delete(key);
      }
    }
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

function clean(messages) {
  if (!Array.isArray(messages)) return null;
  const out = [];
  for (const message of messages.slice(-MAX_TURNS)) {
    if (!message || typeof message.content !== "string") return null;
    const role = message.role === "assistant" ? "assistant" : "user";
    const content = message.content.trim().slice(0, MAX_CHARS);
    if (!content) continue;
    out.push({ role, content });
  }
  if (!out.length || out[out.length - 1].role !== "user") return null;
  return out;
}


const THAI_RE = /[\u0E00-\u0E7F]/;
const LAO_RE = /[\u0E80-\u0EFF]/;

/* Small models drift back to the KB language, so state the reply language last. */
function languageDirective(messages) {
  const last = messages.filter((m) => m.role === "user").pop();
  const text = last ? last.content : "";
  const thai = THAI_RE.test(text);
  const lao = LAO_RE.test(text);
  if (thai && !lao) {
    return "\n\nANSWER LANGUAGE: the visitor wrote in Thai. Write the whole reply in Thai script (ภาษาไทย), never Lao script.";
  }
  if (lao && !thai) {
    return "\n\nANSWER LANGUAGE: the visitor wrote in Lao. Write the whole reply in Lao script.";
  }
  return "\n\nANSWER LANGUAGE: reply in the same language as the visitor's last message.";
}

/* Small models keep answering Thai questions in the KB language; translate as a fallback. */
async function translateToThai(text, base, model, key) {
  try {
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content:
              "Translate the user's text into Thai (ภาษาไทย). Reply with the translation only, no notes, keep names, emails and phone numbers unchanged.",
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (!response.ok) return null;
    const data = await response.json().catch(() => null);
    const out = data?.choices?.[0]?.message?.content;
    return typeof out === "string" && out.trim() ? out.trim() : null;
  } catch {
    return null;
  }
}

/* ---------- contact form ---------- */

const CONTACT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_MAX = 5;
const contactHits = new Map();

const CONTACT_TO_DEFAULT = "hongkham.svnv@outlook.com";
const CONTACT_FROM_DEFAULT = "Portfolio <onboarding@resend.dev>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function contactLimited(ip) {
  const now = Date.now();
  const entry = contactHits.get(ip);
  if (!entry || now - entry.start > CONTACT_WINDOW_MS) {
    contactHits.set(ip, { start: now, count: 1 });
    if (contactHits.size > 500) {
      for (const [key, value] of contactHits) {
        if (now - value.start > CONTACT_WINDOW_MS) contactHits.delete(key);
      }
    }
    return false;
  }
  entry.count += 1;
  return entry.count > CONTACT_MAX;
}

function field(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch],
  );
}

async function handleContact(request, env, origin) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (contactLimited(ip)) {
    return json({ error: "rate_limited" }, 429, origin);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "bad_json" }, 400, origin);
  }
  if (!payload || typeof payload !== "object") {
    return json({ error: "bad_json" }, 400, origin);
  }

  /* Bots fill the hidden field or submit within a second: answer OK so they stop. */
  if (field(payload.company, 80) || Number(payload.elapsedMs) < 2000) {
    return json({ ok: true }, 200, origin);
  }

  const name = field(payload.name, 80);
  const email = field(payload.email, 120);
  const phone = field(payload.phone, 40);
  const subject = field(payload.subject, 140);
  const message = field(payload.message, 2000);
  const channel = field(payload.channel, 40);
  const service = field(payload.service, 80);
  const budget = field(payload.budget, 40);
  const address = field(payload.address, 160);

  if (name.length < 2) return json({ error: "bad_name" }, 400, origin);
  if (!EMAIL_RE.test(email)) return json({ error: "bad_email" }, 400, origin);
  if (subject.length < 2) return json({ error: "bad_subject" }, 400, origin);
  if (message.length < 10) return json({ error: "bad_message" }, 400, origin);

  if (!env.RESEND_KEY) {
    return json({ error: "mail_not_configured" }, 503, origin);
  }

  const rows = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Preferred channel", channel],
    ["Service", service],
    ["Budget", budget],
    ["Address", address],
  ].filter(([, value]) => value);

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;line-height:1.7;color:#111">',
    '<h2 style="margin:0 0 14px;font-size:17px">New message from the portfolio site</h2>',
    '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">',
    ...rows.map(
      ([label, value]) =>
        `<tr><td style="padding:2px 14px 2px 0;color:#666;vertical-align:top">${escapeHtml(label)}</td><td style="padding:2px 0">${escapeHtml(value)}</td></tr>`,
    ),
    "</table>",
    '<p style="margin:18px 0 6px;color:#666">Message</p>',
    `<div style="white-space:pre-wrap;padding:12px 14px;background:#f4f4f7;border-radius:8px">${escapeHtml(message)}</div>`,
    '<p style="margin:18px 0 0;color:#999;font-size:12px">Sent from the contact form. Reply to this email to answer the visitor directly.</p>',
    "</div>",
  ].join("");

  const text = [
    "New message from the portfolio site",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    message,
  ].join("\n");

  let sent;
  try {
    sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM || CONTACT_FROM_DEFAULT,
        to: [env.CONTACT_TO || CONTACT_TO_DEFAULT],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        html,
        text,
      }),
    });
  } catch {
    return json({ error: "mail_unreachable" }, 502, origin);
  }

  if (!sent.ok) {
    return json({ error: "mail_failed", status: sent.status }, 502, origin);
  }

  return json({ ok: true }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "forbidden_origin" }, 403, origin);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const key = env.FREEBUFF_API_KEY || env.AI_KEY;
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");

    if (request.method === "POST" && path.endsWith("/contact")) {
      return handleContact(request, env, origin);
    }

    if (request.method === "GET" && (path === "" || path === "/health")) {
      return json(
        {
          ok: true,
          model: env.AI_MODEL || DEFAULT_MODEL,
          hasKey: Boolean(key),
          hasMailKey: Boolean(env.RESEND_KEY),
        },
        200,
        origin,
      );
    }

    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405, origin);
    }

    if (!key) {
      return json({ error: "not_configured" }, 503, origin);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (tooMany(ip)) {
      return json({ error: "rate_limited" }, 429, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "bad_json" }, 400, origin);
    }

    const messages = clean(payload && payload.messages);
    if (!messages) {
      return json({ error: "bad_messages" }, 400, origin);
    }

    const base = (env.AI_BASE || "https://freebuff.com/api/v1/paid").replace(/\/+$/, "");
    const model = env.AI_MODEL || DEFAULT_MODEL;

    let upstream;
    try {
      upstream = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 500,
          messages: [{ role: "system", content: SYSTEM + languageDirective(messages) }, ...messages],
        }),
      });
    } catch {
      return json({ error: "upstream_unreachable" }, 502, origin);
    }

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return json(
        { error: "upstream_error", status: upstream.status, detail: detail.slice(0, 300) },
        502,
        origin,
      );
    }

    const data = await upstream.json().catch(() => null);
    const answer = data?.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return json({ error: "empty_answer" }, 502, origin);
    }

    let text = answer.trim();
    const askedThai = THAI_RE.test(messages[messages.length - 1].content) &&
      !LAO_RE.test(messages[messages.length - 1].content);
    if (askedThai && LAO_RE.test(text)) {
      const translated = await translateToThai(text, base, model, key);
      if (translated) text = translated;
    }

    return json({ answer: text.slice(0, 2000) }, 200, origin);
  },
};
