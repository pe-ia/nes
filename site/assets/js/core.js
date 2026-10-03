/* NES Study: shared runtime (theme, navigation, quizzes, lab helpers).
   Plain script, no build step, works from file:// as well as any static host. */
(function () {
  "use strict";

  const NES = (window.NES = window.NES || {});

  /* ---------- Storage (per-browser conveniences only) ---------- */
  NES.store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    },
  };

  /* ---------- Theme ---------- */
  const THEME_KEY = "nes-theme";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function effectiveTheme() {
    const forced = document.documentElement.getAttribute("data-theme");
    if (forced) return forced;
    return media && media.matches ? "dark" : "light";
  }
  function applyTheme(theme) {
    if (theme) document.documentElement.setAttribute("data-theme", theme);
    else document.documentElement.removeAttribute("data-theme");
    document.dispatchEvent(new CustomEvent("nes:theme"));
  }
  applyTheme(NES.store.get(THEME_KEY, null));
  if (media && media.addEventListener) {
    media.addEventListener("change", () => document.dispatchEvent(new CustomEvent("nes:theme")));
  }
  NES.toggleTheme = function () {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    NES.store.set(THEME_KEY, next);
    applyTheme(next);
  };

  NES.css = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  /* ---------- Small DOM helpers ---------- */
  NES.h = function (tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "text") el.textContent = v;
        else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    (children || []).forEach((c) => c != null && el.append(c));
    return el;
  };
  const h = NES.h;

  NES.clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  NES.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  NES.gauss = function (rand) {
    let u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  /* ---------- Canvas with DPR, resize and theme redraw ---------- */
  NES.canvas = function (canvas, draw) {
    const ctx = canvas.getContext("2d");
    function render() {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(r.width));
      const hgt = Math.max(1, Math.round(r.height));
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(hgt * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(hgt * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, hgt);
      draw(ctx, w, hgt);
    }
    if (window.ResizeObserver) new ResizeObserver(() => render()).observe(canvas);
    document.addEventListener("nes:theme", render);
    return render;
  };

  /* ---------- Lab scaffolding ---------- */
  NES.lab = function (el, opts) {
    el.classList.add("lab");
    el.innerHTML = "";
    const controls = h("div", { class: "lab-controls" });
    const view = h("div", { class: "lab-view" });
    el.append(
      h("div", { class: "lab-head" }, [
        h("span", { class: "lab-tag", text: "Try it" }),
        h("h3", { html: opts.title }),
      ]),
      opts.hint ? h("p", { class: "lab-hint", html: opts.hint }) : null,
      h("div", { class: "lab-body" }, [controls, view])
    );
    return { controls, view };
  };

  let ctlId = 0;
  NES.slider = function (parent, o) {
    const id = "ctl-" + ++ctlId;
    const out = h("output", { for: id });
    const input = h("input", { id, type: "range", min: o.min, max: o.max, step: o.step || 1, value: o.value });
    const wrap = h("div", { class: "ctl" }, [
      h("label", { class: "ctl-label", for: id }, [h("span", { html: o.label }), out]),
      input,
    ]);
    parent.append(wrap);
    const api = {
      input,
      wrap,
      get value() {
        const raw = parseFloat(input.value);
        return o.map ? o.map(raw) : raw;
      },
      set(v) { input.value = o.unmap ? o.unmap(v) : v; sync(); },
      onchange: null,
    };
    function sync() { out.textContent = o.fmt ? o.fmt(api.value) : String(api.value); }
    input.addEventListener("input", () => { sync(); api.onchange && api.onchange(); });
    sync();
    return api;
  };

  NES.seg = function (parent, o) {
    const wrap = h("div", { class: "ctl" });
    if (o.label) wrap.append(h("div", { class: "ctl-label" }, [h("span", { html: o.label })]));
    const group = h("div", { class: "seg", role: "group", "aria-label": (o.label || "").replace(/<[^>]+>/g, "") });
    const buttons = new Map();
    const api = {
      wrap,
      value: o.value,
      onchange: null,
      set(v, silent) {
        api.value = v;
        buttons.forEach((b, k) => b.setAttribute("aria-pressed", String(k === v)));
        if (!silent && api.onchange) api.onchange();
      },
      disable(flag) { buttons.forEach((b) => (b.disabled = !!flag)); wrap.style.opacity = flag ? "0.55" : ""; },
    };
    o.options.forEach(([val, label]) => {
      const b = h("button", { type: "button", html: label, onclick: () => api.set(val) });
      buttons.set(val, b);
      group.append(b);
    });
    wrap.append(group);
    parent.append(wrap);
    api.set(o.value, true);
    return api;
  };

  NES.group = function (parent, title) {
    const g = h("div", { class: "ctl-group" }, [h("div", { class: "ctl-group-title", html: title })]);
    parent.append(g);
    return g;
  };

  NES.stats = function (parent, defs) {
    const wrap = h("div", { class: "stats" });
    const map = {};
    defs.forEach((d) => {
      const v = h("div", { class: "stat-v", text: "-" });
      const box = h("div", { class: "stat" }, [h("div", { class: "stat-k", html: d.label }), v]);
      map[d.key] = { box, v };
      wrap.append(box);
    });
    parent.append(wrap);
    return {
      wrap,
      set(key, value, tone) {
        const s = map[key];
        s.v.innerHTML = value;
        s.box.className = "stat" + (tone ? " " + tone : "");
      },
    };
  };

  /* Run a callback only while an element is on screen (saves CPU for animations). */
  NES.whenVisible = function (el, onShow, onHide) {
    if (!window.IntersectionObserver) { onShow(); return; }
    new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? onShow() : onHide && onHide()));
    }, { rootMargin: "100px" }).observe(el);
  };

  /* ---------- Quiz engine ---------- */
  NES.initQuizzes = function (pageKey, bank) {
    const storeKey = "nes-quiz-" + pageKey;
    let state = NES.store.get(storeKey, {});
    const all = [];

    function save() { NES.store.set(storeKey, state); }

    document.querySelectorAll(".quiz[data-quiz]").forEach((box) => {
      const topic = box.dataset.quiz;
      const qs = bank[topic] || [];
      box.innerHTML = "";
      box.append(
        h("div", { class: "quiz-head" }, [
          h("span", { class: "quiz-title", text: "Check yourself" }),
          h("span", { class: "quiz-count", text: qs.length + (qs.length === 1 ? " question" : " questions") }),
        ])
      );
      qs.forEach((q, qi) => {
        const qid = topic + "#" + qi;
        all.push({ qid, topic });
        const card = h("div", { class: "q", "data-qid": qid });
        card.append(h("p", { class: "q-text" }, [h("span", { class: "q-num", text: "Q" + (qi + 1) }), h("span", { html: q.q })]));
        const list = h("ol", { class: "opts" });
        q.options.forEach((opt, oi) => {
          const [text, correct, why] = opt;
          const mark = h("span", { class: "opt-mark", "aria-hidden": "true" });
          const btn = h("button", { type: "button", class: "opt", "aria-expanded": "false" }, [
            h("span", { class: "opt-letter", text: "ABCDEF"[oi] }),
            h("span", { class: "opt-text", html: text }),
            mark,
          ]);
          const whyEl = h("div", { class: "why " + (correct ? "good" : "bad"), hidden: true, role: "status" }, [
            h("span", { class: "why-tag", text: correct ? "Correct." : "Not quite." }),
            h("span", { html: why }),
          ]);
          function reveal() {
            btn.classList.add(correct ? "correct" : "wrong");
            mark.textContent = correct ? "✓" : "✗";
            whyEl.hidden = false;
            btn.setAttribute("aria-expanded", "true");
            if (correct) card.classList.add("solved");
          }
          btn.addEventListener("click", () => {
            const s = state[qid] || (state[qid] = { tried: [] });
            if (s.first == null) { s.first = oi; s.firstCorrect = !!correct; }
            if (s.tried.indexOf(oi) === -1) s.tried.push(oi);
            if (correct) s.solved = true;
            save();
            reveal();
            refresh();
          });
          // restore
          const saved = state[qid];
          if (saved && saved.tried && saved.tried.indexOf(oi) !== -1) reveal();
          list.append(h("li", null, [btn, whyEl]));
        });
        card.append(list);
        box.append(card);
      });
    });

    function refresh() {
      const total = all.length;
      let answered = 0, firstRight = 0;
      const perTopic = {};
      all.forEach(({ qid, topic }) => {
        const s = state[qid];
        const t = (perTopic[topic] = perTopic[topic] || { n: 0, solved: 0 });
        t.n++;
        if (s && s.first != null) answered++;
        if (s && s.firstCorrect) firstRight++;
        if (s && s.solved) t.solved++;
      });
      document.querySelectorAll("[data-progress-answered]").forEach((el) => (el.textContent = answered + " / " + total));
      document.querySelectorAll("[data-progress-first]").forEach((el) => (el.textContent = firstRight));
      document.querySelectorAll("[data-progress-bar]").forEach((el) => (el.style.width = (total ? (answered / total) * 100 : 0) + "%"));
      document.querySelectorAll(".toc-dot[data-topic]").forEach((dot) => {
        const t = perTopic[dot.dataset.topic];
        dot.className = "toc-dot" + (t && t.solved === t.n && t.n ? " done" : t && t.solved ? " partial" : "");
        dot.title = t ? t.solved + " of " + t.n + " solved" : "";
      });
      NES.store.set("nes-summary-" + pageKey, { answered, firstRight, total });
    }

    document.querySelectorAll("[data-quiz-reset]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (!window.confirm("Reset all quiz answers on this page?")) return;
        state = {};
        NES.store.remove(storeKey);
        NES.initQuizzes(pageKey, bank);
      })
    );
    refresh();
  };

  /* ---------- Page chrome: TOC, scrollspy, mobile nav, lightbox ---------- */
  NES.initPage = function () {
    // Table of contents from sections
    const toc = document.querySelector("[data-toc]");
    const topics = Array.from(document.querySelectorAll("section.topic"));
    if (toc) {
      const parts = new Map();
      topics.forEach((sec) => {
        const part = sec.dataset.part || "";
        if (!parts.has(part)) parts.set(part, []);
        parts.get(part).push(sec);
      });
      parts.forEach((secs, part) => {
        const ol = h("ol");
        secs.forEach((sec) => {
          const num = sec.querySelector(".topic-num");
          const title = sec.dataset.short || sec.querySelector("h2").textContent;
          ol.append(
            h("li", null, [
              h("a", { href: "#" + sec.id, "data-nav": sec.id }, [
                h("span", { class: "toc-num", text: num ? num.textContent : "" }),
                h("span", { text: title }),
                sec.querySelector(".quiz") ? h("span", { class: "toc-dot", "data-topic": sec.querySelector(".quiz").dataset.quiz }) : h("span"),
              ]),
            ])
          );
        });
        toc.append(h("div", null, [part ? h("p", { class: "toc-part-title", text: part }) : null, ol]));
      });
      const extra = document.querySelectorAll("[data-toc-extra]");
      if (extra.length) {
        const ol = h("ol");
        extra.forEach((sec) =>
          ol.append(h("li", null, [h("a", { href: "#" + sec.id, "data-nav": sec.id }, [h("span", { class: "toc-num", text: "•" }), h("span", { text: sec.dataset.tocExtra }), h("span")])]))
        );
        toc.append(h("div", null, [h("p", { class: "toc-part-title", text: "Review" }), ol]));
      }
    }

    // Scrollspy
    const links = new Map();
    document.querySelectorAll("[data-nav]").forEach((a) => links.set(a.dataset.nav, a));
    const spyTargets = topics.concat(Array.from(document.querySelectorAll("[data-toc-extra]")));
    if (window.IntersectionObserver && spyTargets.length) {
      const visible = new Map();
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null));
          let best = null, bestTop = Infinity;
          spyTargets.forEach((s) => {
            const top = visible.get(s.id);
            if (top != null && Math.abs(top) < bestTop) { best = s.id; bestTop = Math.abs(top); }
          });
          if (best) links.forEach((a, id) => a.classList.toggle("active", id === best));
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      spyTargets.forEach((s) => io.observe(s));
    }

    // Mobile nav
    document.querySelectorAll("[data-nav-toggle]").forEach((b) =>
      b.addEventListener("click", () => document.body.classList.toggle("nav-open"))
    );
    document.querySelectorAll(".scrim, .toc a").forEach((el) =>
      el.addEventListener("click", () => document.body.classList.remove("nav-open"))
    );
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", NES.toggleTheme));

    // Lightbox for slide figures
    const lb = h("div", { class: "lightbox", role: "dialog", "aria-label": "Enlarged figure" }, [h("img", { alt: "" })]);
    document.body.append(lb);
    const lbImg = lb.querySelector("img");
    lb.addEventListener("click", () => lb.classList.remove("open"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { lb.classList.remove("open"); document.body.classList.remove("nav-open"); } });
    document.querySelectorAll(".fig-frame img").forEach((img) => {
      const btn = h("button", { type: "button", class: "fig-zoom", "aria-label": "Enlarge figure: " + img.alt });
      img.replaceWith(btn);
      btn.append(img);
      btn.addEventListener("click", () => {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lb.classList.add("open");
      });
    });
  };
})();
