(function () {
  "use strict";

  // The conversation is kept exactly as the API returned it and only ever appended to:
  // the server needs earlier turns back byte for byte.
  var KEY = "sl-chat";
  var STARTERS = ["What do you do?", "How does reactivation work?", "Is texting old customers legal?", "How much does it cost?"];
  var GREETING = "Hi, I'm Surge Lab's AI assistant. Ask me anything about what we do, and a person can take over any time.";

  function load() {
    try { return JSON.parse(sessionStorage.getItem(KEY)) || { messages: [], open: false }; }
    catch (e) { return { messages: [], open: false }; }
  }
  function save() {
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  var state = load();
  var busy = false;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Plain text in, safe HTML out: site paths, emails and the phone number become links.
  function format(text) {
    return esc(text)
      .replace(/(^|[\s(])(\/[a-z-]+)(?=[\s).,!?]|$)/gm, '$1<a href="$2">$2</a>')
      .replace(/\binfo@surgelab\.co\.uk\b/g, '<a href="mailto:info@surgelab.co.uk">info@surgelab.co.uk</a>')
      .replace(/\b07305 880813\b/g, '<a href="tel:+447305880813">07305 880813</a>')
      .replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br>");
  }
  function textOf(content) {
    if (typeof content === "string") return content;
    return (content || []).filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; }).join("\n\n").trim();
  }

  var icon = function (id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  var root = document.createElement("div");
  root.className = "chat";
  root.innerHTML =
    '<button class="chat-launch" type="button" aria-expanded="false" aria-controls="chat-panel" aria-label="Ask our AI assistant">' + icon("i-msg") + '<span>Ask our AI</span></button>' +
    '<section class="chat-panel" id="chat-panel" role="dialog" aria-label="Chat with Surge Lab\'s AI assistant" hidden>' +
      '<header class="chat-head"><div><b>Surge Lab assistant</b><small>AI assistant. A person can take over any time.</small></div>' +
      '<button class="chat-new" type="button">New chat</button>' +
      '<button class="chat-close" type="button" aria-label="Close chat">' + icon("i-plus") + '</button></header>' +
      '<div class="chat-log" aria-live="polite"></div>' +
      '<div class="chat-starters"></div>' +
      '<form class="chat-form"><label class="sr-only" for="chat-input">Your message</label>' +
      '<textarea id="chat-input" rows="1" maxlength="800" placeholder="Ask a question..." autocomplete="off"></textarea>' +
      '<button class="chat-send" type="submit" aria-label="Send">' + icon("i-arrow") + '</button></form>' +
      '<p class="chat-note">AI can make mistakes. Please don\'t share sensitive details. <a href="/privacy">Privacy</a></p>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector(".chat-launch");
  var panel = root.querySelector(".chat-panel");
  var log = root.querySelector(".chat-log");
  var starters = root.querySelector(".chat-starters");
  var form = root.querySelector(".chat-form");
  var input = root.querySelector("#chat-input");

  function bubble(who, html) {
    var p = document.createElement("div");
    p.className = "chat-msg " + who;
    p.innerHTML = "<p>" + html + "</p>";
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    return p;
  }
  function render() {
    log.innerHTML = "";
    bubble("bot", esc(GREETING));
    state.messages.forEach(function (m) {
      var t = textOf(m.content);
      if (!t) return;
      bubble(m.role === "user" ? "me" : "bot", m.role === "user" ? esc(t) : format(t));
    });
    starters.innerHTML = "";
    if (!state.messages.length) {
      STARTERS.forEach(function (s) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = s;
        b.addEventListener("click", function () { send(s); });
        starters.appendChild(b);
      });
    }
  }

  function setOpen(open) {
    state.open = open;
    save();
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", open ? "true" : "false");
    root.classList.toggle("is-open", open);
    if (open) {
      render();
      setTimeout(function () { input.focus(); }, 30);
    } else {
      launch.focus();
    }
  }

  function send(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    busy = true;
    starters.innerHTML = "";
    bubble("me", esc(text));
    var typing = bubble("bot typing", "<span></span><span></span><span></span>");
    typing.setAttribute("aria-label", "Typing");
    input.value = "";
    input.style.height = "";
    fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: state.messages, input: text })
    })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (data) {
        typing.remove();
        if (data.reset) state.messages = [];
        if (Array.isArray(data.append)) state.messages = state.messages.concat(data.append);
        save();
        bubble("bot", format(data.reply || "Sorry, something went wrong. Book a call at /book or ring 07305 880813."));
        if (data.callback && window.gtag) gtag("event", "chat_callback_requested");
      })
      .catch(function () {
        typing.remove();
        bubble("bot", format("I couldn't connect just then. Try again, or book a call at /book."));
      })
      .then(function () {
        busy = false;
        input.focus();
      });
    if (state.messages.length === 0 && window.gtag) gtag("event", "chat_started");
  }

  launch.addEventListener("click", function () { setOpen(!state.open); });
  root.querySelector(".chat-close").addEventListener("click", function () { setOpen(false); });
  root.querySelector(".chat-new").addEventListener("click", function () {
    state.messages = [];
    save();
    render();
    input.focus();
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); send(input.value); });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); }
  });
  input.addEventListener("input", function () {
    input.style.height = "";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && state.open) setOpen(false);
  });
  document.querySelectorAll("[data-open-chat]").forEach(function (b) {
    b.addEventListener("click", function () { setOpen(true); });
  });

  if (state.open) setOpen(true);
})();
