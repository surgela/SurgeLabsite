import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, CALLBACK_TOOL } from "./chat-prompt.js";

const MODEL = "claude-haiku-5-5";
// block_binding drops (rather than rejects) thinking blocks if a visitor's stored history
// has been altered. Haiku has no server-side fallback, so declines are handled below.
const BETAS = ["thinking-binding-controls-2026-08-01"];
const MAX_USER_TURNS = 20;
const MAX_INPUT_CHARS = 800;
const MAX_BODY_CHARS = 200000;
const MAX_TOOL_ROUNDS = 3;

const CONTACT = "Book a 15-minute call at /book, ring 07305 880813 or email info@surgelab.co.uk.";
const TEXT = {
  trouble: "Sorry, I'm having trouble answering right now. " + CONTACT,
  slowDown: "You're sending messages faster than I can keep up. Give it a minute and try again.",
  refused: "That's not one I can help with here, but the team can. " + CONTACT,
  limit: "We've covered a lot, so a quick chat with the team is the best next step. " + CONTACT,
  offline: "The assistant isn't switched on yet. " + CONTACT,
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// The browser stores the conversation exactly as the API returned it and sends it back
// unchanged. Check its shape and keep out anything that would cost us money to process.
function validHistory(messages) {
  if (!Array.isArray(messages) || messages.length > 4 * MAX_USER_TURNS) return false;
  if (messages.length && messages[0].role !== "user") return false;
  return messages.every((m) => {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return false;
    if (m.role === "user") {
      if (typeof m.content === "string") return m.content.length <= MAX_INPUT_CHARS;
      return Array.isArray(m.content) && m.content.every((b) => b && b.type === "tool_result" && typeof b.content === "string" && b.content.length <= 500);
    }
    return Array.isArray(m.content) && m.content.every((b) => b && typeof b.type === "string" && b.type !== "image" && b.type !== "document");
  });
}

const visibleText = (content) =>
  typeof content === "string"
    ? content
    : (content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n\n").trim();

function transcript(messages) {
  return messages
    .filter((m) => typeof m.content === "string" || m.role === "assistant")
    .map((m) => ({ who: m.role === "user" ? "Visitor" : "Assistant", text: visibleText(m.content) }))
    .filter((t) => t.text)
    .slice(-12)
    .map((t) => `<p><b>${t.who}:</b> ${esc(t.text).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

async function requestCallback(block, env, sendEmail, messages) {
  const { name = "", phone = "", email = "", business = "", note = "" } = block.input || {};
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const okPhone = cleanPhone.length >= 7 && cleanPhone.length <= 16;
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
  const fail = (msg) => ({ type: "tool_result", tool_use_id: block.id, is_error: true, content: msg });
  if (!name.trim() || name.length > 80) return { result: fail("A first name is needed."), sent: false };
  if (!okPhone && !okEmail) return { result: fail("A valid phone number or email address is needed."), sent: false };

  const html =
    "<h2>Callback request from the website chatbot</h2>" +
    `<p><b>Name:</b> ${esc(name)}</p>` +
    `<p><b>Business:</b> ${esc(business || "-")}</p>` +
    `<p><b>Phone:</b> ${esc(okPhone ? phone : "-")}</p>` +
    `<p><b>Email:</b> ${esc(okEmail ? email : "-")}</p>` +
    `<p><b>What they want:</b> ${esc(note.slice(0, 1000) || "-")}</p>` +
    "<h3>Conversation</h3>" + transcript(messages);
  const sent = await sendEmail(env, {
    name,
    email: okEmail ? email : "info@surgelab.co.uk",
    subject: `Chatbot callback request: ${name.slice(0, 80)}`,
    html,
  });
  return sent
    ? { result: { type: "tool_result", tool_use_id: block.id, content: "Sent to the team. They will be in touch the same working day." }, sent: true }
    : { result: fail("The request didn't send. Ask them to ring 07305 880813 or book at /book instead."), sent: false };
}

function requestParams(messages) {
  return {
    model: MODEL,
    max_tokens: 4000,
    betas: BETAS,
    thinking: { type: "adaptive", block_binding: { prefix_mismatch_behavior: "drop_block" } },
    output_config: { effort: "low" },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    tools: [CALLBACK_TOOL],
    cache_control: { type: "ephemeral" },
    messages,
  };
}

export async function handleChat(request, env, sendEmail) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!(request.headers.get("content-type") || "").includes("application/json")) return json({ error: "Bad request" }, 400);

  if (env.CHAT_LIMITER) {
    const ip = request.headers.get("cf-connecting-ip") || "local";
    const { success } = await env.CHAT_LIMITER.limit({ key: "chat:" + ip });
    if (!success) return json({ reply: TEXT.slowDown, append: [] }, 429);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) return json({ reply: TEXT.limit, append: [], reset: true }, 413);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const history = body.messages || [];
  const input = typeof body.input === "string" ? body.input.trim() : "";
  if (!input || input.length > MAX_INPUT_CHARS) return json({ error: "Message missing or too long" }, 400);
  if (!validHistory(history)) return json({ reply: TEXT.trouble, append: [], reset: true }, 400);
  if (history.filter((m) => typeof m.content === "string").length >= MAX_USER_TURNS) {
    return json({ reply: TEXT.limit, append: [] });
  }

  const userMsg = { role: "user", content: input };
  if (env.CHAT_MOCK === "1") {
    const reply = `Test mode: no AI is connected. You said "${input.slice(0, 120)}". Book a call at /book.`;
    return json({ reply, append: [userMsg, { role: "assistant", content: [{ type: "text", text: reply }] }] });
  }
  if (!env.ANTHROPIC_API_KEY) return json({ reply: TEXT.offline, append: [] }, 503);

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 30000 });
  const messages = [...history, userMsg];
  const append = [userMsg];
  let reply = "";
  let callback = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    let response;
    try {
      response = await client.beta.messages.create(requestParams(messages));
    } catch (err) {
      if (err instanceof Anthropic.BadRequestError) {
        // Usually a stored history the API can't accept (for example a tampered block): start afresh.
        console.error("chat 400", err.message);
        return json({ reply: TEXT.trouble, append: [], reset: true }, 400);
      }
      if (err instanceof Anthropic.RateLimitError) {
        console.error("chat rate limited");
      } else if (err instanceof Anthropic.APIError) {
        console.error("chat API error", err.status, err.message);
      } else {
        console.error("chat error", err && err.message);
      }
      return json({ reply: TEXT.trouble, append: [] }, 502);
    }

    const u = response.usage || {};
    console.log("chat usage", JSON.stringify({ in: u.input_tokens, out: u.output_tokens, cacheRead: u.cache_read_input_tokens, cacheWrite: u.cache_creation_input_tokens, stop: response.stop_reason }));

    if (response.stop_reason === "refusal") {
      reply = TEXT.refused;
      break;
    }

    const assistantMsg = { role: "assistant", content: response.content };
    messages.push(assistantMsg);
    append.push(assistantMsg);

    if (response.stop_reason === "tool_use") {
      const results = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        if (block.name === "request_callback" && !callback) {
          const { result, sent } = await requestCallback(block, env, sendEmail, messages);
          results.push(result);
          callback = callback || sent;
        } else {
          results.push({ type: "tool_result", tool_use_id: block.id, is_error: true, content: "Only one callback request can be sent per message." });
        }
      }
      const toolMsg = { role: "user", content: results };
      messages.push(toolMsg);
      append.push(toolMsg);
      continue;
    }

    reply = visibleText(response.content);
    break;
  }

  return json({ reply: reply || TEXT.trouble, append, callback });
}
