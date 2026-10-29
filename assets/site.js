(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Header: mobile menu and dropdowns ---------- */
  var header = document.querySelector(".site-header");
  var menuBtn = document.querySelector(".menu-btn");
  if (menuBtn && header) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var ddButtons = document.querySelectorAll(".dd > button[aria-controls]");
  function closeAll(except) {
    ddButtons.forEach(function (b) {
      if (b === except) return;
      b.setAttribute("aria-expanded", "false");
      document.getElementById(b.getAttribute("aria-controls")).hidden = true;
    });
  }
  ddButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var open = btn.getAttribute("aria-expanded") === "true";
      closeAll(btn);
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".dd")) closeAll();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openBtn = document.querySelector('.dd > button[aria-expanded="true"]');
    closeAll();
    if (openBtn) openBtn.focus();
    if (header && header.classList.contains("open")) {
      header.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.focus();
    }
  });

  /* ---------- Cookie consent: nothing loads until Accept ---------- */
  var CONSENT_KEY = "sl-consent";
  var GA_ID = "G-PN03EJ0BLN";
  var ADS_ID = "AW-18109052484";
  var analyticsOn = false;

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {}
  }
  function loadAnalytics() {
    if (analyticsOn) return;
    analyticsOn = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID);
    gtag("config", ADS_ID);
  }
  function track(name, params) {
    if (analyticsOn && window.gtag) gtag("event", name, params || {});
  }

  var banner = document.getElementById("cookie");
  if (banner) {
    var choice = getConsent();
    if (choice === "accepted") loadAnalytics();
    else if (!choice) banner.hidden = false;
    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (!b) return;
      var v = b.getAttribute("data-consent");
      setConsent(v);
      banner.hidden = true;
      if (v === "accepted") loadAnalytics();
    });
  }
  document.querySelectorAll("[data-cookie-settings]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (banner) banner.hidden = false;
    });
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-track]");
    if (a) track(a.getAttribute("data-track"), { link_url: a.getAttribute("href") || "" });
  });

  /* ---------- Smooth scroll ---------- */
  if (!reduce && window.Lenis) {
    var lenis = new Lenis({ lerp: 0.12 });
    if (hasGsap) {
      if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }

  /* ---------- Hero: the lock screen fills up ---------- */
  var notes = document.querySelectorAll("#notes .note");
  var lockTime = document.getElementById("lockTime");
  var lockDate = document.getElementById("lockDate");
  if (notes.length && hasGsap && !reduce) {
    var list = Array.prototype.slice.call(notes).reverse();
    var setClock = function (li) {
      lockTime.textContent = li.getAttribute("data-time");
      lockDate.textContent = li.getAttribute("data-date");
    };
    gsap.set(notes, { height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0, opacity: 0 });
    setClock(list[0]);
    var tl = gsap.timeline({ paused: true, delay: 0.5 });
    list.forEach(function (li, i) {
      tl.call(setClock, [li], i === 0 ? 0 : "+=0.9");
      tl.to(li, {
        height: "auto", paddingTop: "0.7rem", paddingBottom: "0.7rem", marginBottom: "0.5rem", opacity: 1,
        duration: 0.7, ease: "expo.out"
      }, "<");
      tl.from(li, { y: -14, scale: 0.96, duration: 0.7, ease: "expo.out" }, "<");
    });
    if (window.ScrollTrigger) {
      ScrollTrigger.create({ trigger: "#notes", start: "top 85%", once: true, onEnter: function () { tl.play(); } });
    } else {
      tl.play();
    }
  }

  /* ---------- Example threads: messages arrive in order ---------- */
  if (hasGsap && window.ScrollTrigger && !reduce) {
    document.querySelectorAll("[data-thread]").forEach(function (t) {
      gsap.from(t.querySelectorAll(".msg, .msg-time, .msg-sys"), {
        opacity: 0, y: 12, duration: 0.6, ease: "expo.out", stagger: 0.28,
        scrollTrigger: { trigger: t, start: "top 75%", once: true }
      });
    });
  }

  /* ---------- Reactivation calculator ---------- */
  var calc = document.getElementById("calc");
  if (calc) {
    var $ = function (id) { return document.getElementById(id); };
    var fmt = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
    var num = new Intl.NumberFormat("en-GB");
    var shown = 0;
    var fill = function (input) {
      var p = (input.value - input.min) / (input.max - input.min) * 100;
      input.style.setProperty("--p", p + "%");
    };
    var update = function () {
      var q = +$("c-quotes").value;
      var w = $("c-won");
      w.max = q;
      if (+w.value > q) w.value = q;
      var won = +w.value;
      var v = +$("c-value").value;
      var m = +$("c-months").value;
      var r = +$("c-rate").value;
      var cold = (q - won) * m;
      var jobs = Math.round(cold * r / 100);
      var total = jobs * v;

      $("o-quotes").textContent = num.format(q);
      $("o-won").textContent = num.format(won);
      $("o-value").textContent = fmt.format(v);
      $("o-months").textContent = m + (m === 1 ? " month" : " months");
      $("o-rate").textContent = r + "%";
      $("r-cold").textContent = num.format(cold);
      $("r-jobs").textContent = num.format(jobs);
      $("r-jobs2").textContent = num.format(jobs) + (jobs === 1 ? " job" : " jobs");
      calc.querySelectorAll("input[type=range]").forEach(fill);

      var big = $("r-total");
      if (hasGsap && !reduce) {
        var o = { n: shown };
        gsap.to(o, { n: total, duration: 0.6, ease: "expo.out", overwrite: true,
          onUpdate: function () { big.textContent = fmt.format(o.n); } });
      } else {
        big.textContent = fmt.format(total);
      }
      shown = total;
    };
    calc.addEventListener("input", update);
    calc.addEventListener("change", function () { track("calculator_used"); }, { once: true });
    update();
  }

  /* ---------- Enquiry form ---------- */
  var form = document.getElementById("enquiry");
  if (form) {
    var msg = form.querySelector(".form-msg");
    var esc = function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var bad = null;
      ["name", "phone", "email"].forEach(function (k) {
        var el = form.elements[k];
        var ok = el.value.trim() !== "" && el.checkValidity();
        el.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !bad) bad = el;
      });
      if (bad) {
        msg.hidden = false;
        msg.dataset.state = "err";
        msg.textContent = "Check the highlighted fields: we need your name, a mobile number and an email.";
        bad.focus();
        return;
      }
      var consent = form.elements.sms_consent.checked;
      var html =
        "<h2>New enquiry from surgelab.co.uk</h2>" +
        "<p><b>Name:</b> " + esc(d.get("name")) + "</p>" +
        "<p><b>Business:</b> " + esc(d.get("business") || "-") + "</p>" +
        "<p><b>Mobile:</b> " + esc(d.get("phone")) + "</p>" +
        "<p><b>Email:</b> " + esc(d.get("email")) + "</p>" +
        "<p><b>SMS consent:</b> " + (consent ? "Yes" : "No") + "</p>" +
        "<p><b>Message:</b><br>" + esc(d.get("message") || "-").replace(/\n/g, "<br>") + "</p>" +
        "<p><b>Page:</b> " + esc(location.pathname) + "</p>";
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Sending...";
      // The instant text-back hooks in here once the SMS reply handler is live,
      // and only fires when sms_consent is ticked.
      fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.get("name"),
          email: d.get("email"),
          subject: "Website enquiry: " + d.get("name"),
          html: html
        })
      })
        .then(function (r) { if (!r.ok) throw new Error(r.status); })
        .then(function () {
          msg.hidden = false;
          msg.dataset.state = "ok";
          msg.textContent = consent
            ? "Got it. We'll text you back the same working day."
            : "Got it. We'll get back to you the same working day.";
          form.reset();
          track("generate_lead", { form: "enquiry", sms_consent: consent });
        })
        .catch(function () {
          msg.hidden = false;
          msg.dataset.state = "err";
          msg.textContent = "That didn't send. Try again, or email info@surgelab.co.uk.";
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = "Send it over";
        });
    });
  }

  /* ---------- Lead follow-up demo: text me now ---------- */
  var demo = document.getElementById("demo-text");
  if (demo) {
    var dmsg = demo.querySelector(".form-msg");
    var say = function (state, text) {
      dmsg.hidden = false;
      dmsg.dataset.state = state;
      dmsg.textContent = text;
    };
    demo.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = demo.elements.name, phone = demo.elements.phone, ok = demo.elements.sms_consent;
      [name, phone].forEach(function (el) {
        el.setAttribute("aria-invalid", el.value.trim() !== "" && el.checkValidity() ? "false" : "true");
      });
      if (!name.value.trim() || !phone.checkValidity() || !phone.value.trim()) {
        say("err", "We need your first name and a mobile number to send the text.");
        return;
      }
      if (!ok.checked) {
        say("err", "Tick the box so we're allowed to text you.");
        ok.focus();
        return;
      }
      var btn = demo.querySelector("button[type=submit]");
      btn.disabled = true;
      fetch("/demo-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.value.trim(), phone: phone.value.trim(), sms_consent: true })
      })
        .then(function (r) { if (!r.ok) throw new Error(r.status); })
        .then(function () {
          say("ok", "Sent. Keep an eye on your phone: it should land within 60 seconds.");
          demo.reset();
          track("demo_text_requested");
        })
        .catch(function () {
          say("err", "The demo isn't switched on yet. Book a 15-minute call and we'll show you it live.");
        })
        .then(function () { btn.disabled = false; });
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
