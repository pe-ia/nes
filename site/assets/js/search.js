/* Study search: a keyword search box for the home page of a study site.
   Runs entirely in the browser (no server, no dependencies), so it works on GitHub Pages and from file://.
   The same file is used by the ADS, NES and PA study sites.

   Usage:
     StudySearch.mount(containerElement, {
       placeholder: "Search ...",
       load: function () { return Promise<entries> }   // called once, on first use
     });
   An entry is { url, where, num, title, sub, body }:
     url    link to the item (page.html#id)
     where  which page it is on, for example "Week 5 · Network Flow I"
     num    the item's number or label on that page, for example "Exercise 3" or "07"
     title  the item's title          sub  an optional subtitle
     body   plain text of the item (used for matching and for the snippet)

   Matching is by keyword, forgiving of typos: each query word matches index words exactly,
   as a prefix, or within a small edit distance. Items are ranked by how many query words they
   cover, how rare those words are, and whether they occur in the title. */
(function () {
  "use strict";

  const STOP = new Set(("a an and are as at be but by can do does for from has have how i if in into is it its of on or " +
    "so than that the their then there these this to was what when where which who why will with you your").split(" "));

  function fold(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function stem(w) {
    if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
    if (w.length > 3 && w.endsWith("s") && !/(ss|us|is)$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function words(s) { return (fold(s).match(/[a-z0-9]+/g) || []).map(stem); }

  /* Turns HTML with TeX into readable plain text. */
  const TEX = { le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠", to: "→", leftarrow: "←", gets: "←", cdot: "·", times: "×", infty: "∞", "in": "∈", subseteq: "⊆", cup: "∪", setminus: "∖", dots: "…", ldots: "…", cdots: "…", star: "⋆", Theta: "Θ", Delta: "Δ", Sigma: "Σ", Omega: "Ω", pi: "π", delta: "δ", alpha: "α", beta: "β", varepsilon: "ε", ell: "l", iff: "⇔", equiv: "≡", approx: "≈", ll: "≪", gg: "≫", lceil: "⌈", rceil: "⌉", sum: "Σ", bmod: " mod ", pmod: " mod ", log: "log", min: "min", max: "max", Pr: "Pr", OPT: "OPT" };
  const ENT = { lt: "<", gt: ">", amp: "&", nbsp: " ", quot: '"', apos: "'", rsquo: "'", lsquo: "'", middot: "·", rarr: "→", larr: "←", uarr: "↑", darr: "↓", rArr: "⇒", Omega: "Ω", Sigma: "Σ", asymp: "≈", times: "×", deg: "°", hellip: "…", micro: "µ", pi: "π", ge: "≥", le: "≤", tau: "τ", plusmn: "±", radic: "√", isin: "∈", oslash: "ø", raquo: "»", laquo: "«", infin: "∞", alpha: "α", beta: "β", mu: "μ", Delta: "Δ", lambda: "λ" };
  function clean(html) {
    return String(html)
      .replace(/<(svg|script|style)[\s\S]*?<\/\1>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&#(\d+);/g, function (_, n) { return String.fromCodePoint(Number(n)); })
      .replace(/&([a-zA-Z]+);/g, function (m, n) { return ENT[n] != null ? ENT[n] : m; })
      .replace(/\\(text|mathrm|mathtt|mathit|mathbf|operatorname|dfrac|tfrac|frac|big|Big|bigl|bigr|left|right|quad|qquad|underbrace|begin|end|xrightarrow)\b/g, " ")
      .replace(/\\([a-zA-Z]+)/g, function (_, c) { return TEX[c] != null ? TEX[c] : " "; })
      .replace(/\\[,;!\\{}$ ]/g, " ")
      .replace(/[${}]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* Damerau-Levenshtein distance, giving up early when it exceeds max. */
  function distance(a, b, max) {
    const la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    let prev2 = null, prev = new Array(lb + 1), cur = new Array(lb + 1);
    for (let j = 0; j <= lb; j++) prev[j] = j;
    for (let i = 1; i <= la; i++) {
      cur[0] = i;
      let rowMin = cur[0];
      for (let j = 1; j <= lb; j++) {
        const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (prev2 && i > 1 && j > 1 && a.charCodeAt(i - 1) === b.charCodeAt(j - 2) && a.charCodeAt(i - 2) === b.charCodeAt(j - 1)) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
      const t = prev2 || new Array(lb + 1); prev2 = prev; prev = cur; cur = t;
    }
    return prev[lb];
  }

  function buildIndex(entries) {
    const df = new Map();
    const docs = entries.map(function (e) {
      const w = new Map(); // word -> [count in title, count in body]
      words((e.num || "") + " " + (e.title || "") + " " + (e.sub || "")).forEach(function (x) { const c = w.get(x) || [0, 0]; c[0]++; w.set(x, c); });
      words(e.body || "").forEach(function (x) { const c = w.get(x) || [0, 0]; c[1]++; w.set(x, c); });
      w.forEach(function (_, x) { df.set(x, (df.get(x) || 0) + 1); });
      return { e: e, w: w };
    });
    return { docs: docs, df: df, vocab: Array.from(df.keys()), cache: new Map() };
  }

  /* Index words that a query word may stand for, with a quality between 0 and 1. */
  function candidates(ix, q) {
    if (ix.cache.has(q)) return ix.cache.get(q);
    const out = new Map();
    if (ix.df.has(q)) out.set(q, 1);
    // With an exact match, still allow one edit on longer words (quantisation / quantization).
    const maxD = out.size ? (q.length >= 6 ? 1 : 0) : q.length < 4 ? 0 : q.length < 6 ? 1 : q.length < 9 ? 2 : 3;
    for (let i = 0; i < ix.vocab.length; i++) {
      const v = ix.vocab[i];
      if (v === q) continue;
      if (q.length >= 3 && v.length > q.length && v.startsWith(q)) { out.set(v, Math.max(out.get(v) || 0, 0.75)); continue; }
      if (maxD && v.charCodeAt(0) === q.charCodeAt(0)) {
        const d = distance(q, v, maxD);
        if (d <= maxD) out.set(v, Math.max(out.get(v) || 0, 0.75 - 0.12 * d));
      }
    }
    ix.cache.set(q, out);
    return out;
  }

  function search(ix, query, limit) {
    let qs = Array.from(new Set(words(query)));
    const content = qs.filter(function (w) { return !STOP.has(w); });
    if (content.length) qs = content;
    if (!qs.length) return [];
    const N = ix.docs.length;
    const cands = qs.map(function (q) { return candidates(ix, q); });
    const exact = qs.map(function (q) { return ix.df.has(q) ? Math.log(1 + N / ix.df.get(q)) : Infinity; });
    const results = [];
    ix.docs.forEach(function (d) {
      let score = 0, hit = 0;
      const used = [];
      cands.forEach(function (cm, qi) {
        let best = 0, bestWord = null;
        cm.forEach(function (quality, word) {
          const c = d.w.get(word);
          if (!c) return;
          // A loose match never counts as rarer than the exact word the user typed.
          const idf = Math.min(Math.log(1 + N / ix.df.get(word)), exact[qi]);
          const s = quality * idf * ((c[0] ? 3 : 0) + c[1] / (c[1] + 1.5));
          if (s > best) { best = s; bestWord = word; }
        });
        if (bestWord) { score += best; hit++; used.push(bestWord); }
      });
      if (!hit) return;
      const cover = hit / qs.length;
      results.push({ e: d.e, score: score * cover, used: used });
    });
    results.sort(function (a, b) { return b.score - a.score; });
    return results.slice(0, limit || 8);
  }

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function markUp(text, used) {
    let html = esc(text);
    if (!used.length) return html;
    const re = new RegExp("(^|[^a-z0-9])((?:" + used.map(function (u) { return u.replace(/[^a-z0-9]/g, ""); }).filter(Boolean).join("|") + ")[a-z0-9]*)", "gi");
    return html.replace(re, "$1<mark>$2</mark>");
  }
  function snippet(body, used) {
    if (!body) return "";
    const low = body.toLowerCase();
    let at = -1;
    used.forEach(function (u) {
      const m = new RegExp("(^|[^a-z0-9])" + u.replace(/[^a-z0-9]/g, "")).exec(low);
      if (m && (at < 0 || m.index < at)) at = m.index;
    });
    if (at < 0) at = 0;
    let a = Math.max(0, at - 60), b = Math.min(body.length, at + 150);
    while (a > 0 && /\S/.test(body[a - 1])) a--;
    while (b < body.length && /\S/.test(body[b])) b++;
    return (a > 0 ? "… " : "") + body.slice(a, b) + (b < body.length ? " …" : "");
  }

  const CSS = [
    ".ss{--ss-card:var(--card,var(--panel,#fff));--ss-muted:var(--muted,var(--ink-3,#6a675f));--ss-line:var(--line,#ddd);--ss-accent:var(--accent,#0f6e6e);--ss-soft:var(--accent-soft,#eef3f3);margin:28px 0 8px}",
    ".ss-box{display:flex;align-items:center;gap:10px;background:var(--ss-card);border:1px solid var(--ss-line);border-radius:12px;padding:0 14px;box-shadow:0 1px 2px rgba(20,25,40,.05)}",
    ".ss-box:focus-within{border-color:var(--ss-accent);box-shadow:0 0 0 3px var(--ss-soft)}",
    ".ss-box svg{flex:none;width:18px;height:18px;color:var(--ss-muted)}",
    ".ss-input{flex:1;min-width:0;border:0;outline:0;background:none;color:inherit;font:inherit;font-size:16px;padding:13px 0}",
    ".ss-input::-webkit-search-cancel-button{display:none}",
    ".ss-key{flex:none;font:12px ui-monospace,Menlo,monospace;color:var(--ss-muted);border:1px solid var(--ss-line);border-bottom-width:2px;border-radius:5px;padding:1px 7px}",
    ".ss-status{font-size:13px;color:var(--ss-muted);margin:8px 2px 0;min-height:1.2em}",
    ".ss-results{list-style:none;margin:8px 0 0;padding:6px;background:var(--ss-card);border:1px solid var(--ss-line);border-radius:12px;box-shadow:0 6px 24px rgba(20,25,40,.08)}",
    ".ss-results li{margin:0}",
    ".ss-hit{display:block;padding:10px 12px;border-radius:8px;text-decoration:none;color:inherit}",
    ".ss-hit:hover,.ss-hit.active{background:var(--ss-soft)}",
    ".ss-where{font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ss-accent)}",
    ".ss-title{font-weight:650;font-size:16px;margin:1px 0 2px}",
    ".ss-num{display:inline-block;font-size:12.5px;font-weight:700;color:var(--ss-muted);border:1px solid var(--ss-line);border-radius:99px;padding:0 8px;margin-right:8px;vertical-align:1px}",
    ".ss-snip{font-size:13.5px;line-height:1.45;color:var(--ss-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
    ".ss mark{background:none;color:inherit;font-weight:700;text-decoration:underline;text-decoration-color:var(--ss-accent);text-decoration-thickness:2px;text-underline-offset:2px}",
  ].join("\n");

  function mount(container, opts) {
    if (!document.getElementById("ss-style")) {
      const st = document.createElement("style");
      st.id = "ss-style";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    container.classList.add("ss");
    container.innerHTML =
      '<div class="ss-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>' +
      '<input class="ss-input" type="search" autocomplete="off" spellcheck="false" aria-label="Search the notes" aria-controls="ss-results">' +
      '<span class="ss-key" aria-hidden="true">/</span></div>' +
      '<ol class="ss-results" id="ss-results" hidden></ol><p class="ss-status" role="status"></p>';
    const input = container.querySelector(".ss-input");
    const list = container.querySelector(".ss-results");
    const status = container.querySelector(".ss-status");
    input.placeholder = opts.placeholder || "Search all pages";
    let ix = null, loading = null, active = -1, timer = null;

    function ensure() {
      if (ix) return Promise.resolve(ix);
      if (!loading) {
        status.textContent = "Loading the search index ...";
        loading = Promise.resolve().then(opts.load).then(function (entries) {
          ix = buildIndex(entries || []);
          status.textContent = "";
          return ix;
        }).catch(function (err) {
          loading = null;
          status.textContent = "The search index could not be loaded.";
          throw err;
        });
      }
      return loading;
    }
    function setActive(i) {
      const hits = list.querySelectorAll(".ss-hit");
      active = hits.length ? (i + hits.length) % hits.length : -1;
      hits.forEach(function (h, k) { h.classList.toggle("active", k === active); });
      if (active >= 0 && hits[active].scrollIntoView) hits[active].scrollIntoView({ block: "nearest" });
    }
    function render() {
      const q = input.value.trim();
      if (!q) { list.hidden = true; list.innerHTML = ""; status.textContent = ""; active = -1; return; }
      ensure().then(function () {
        if (input.value.trim() !== q) return; // a newer query is on its way
        const res = search(ix, q, opts.limit || 8);
        list.innerHTML = res.map(function (r) {
          const e = r.e;
          return '<li><a class="ss-hit" href="' + esc(e.url) + '">' +
            '<div class="ss-where">' + esc(e.where || "") + "</div>" +
            '<div class="ss-title">' + (e.num ? '<span class="ss-num">' + esc(e.num) + "</span>" : "") + markUp(e.title || "", r.used) + "</div>" +
            '<div class="ss-snip">' + markUp(snippet((e.sub ? e.sub + ". " : "") + (e.body || ""), r.used), r.used) + "</div></a></li>";
        }).join("");
        list.hidden = !res.length;
        status.textContent = res.length ? "" : "No matches. Try fewer or different words.";
        active = -1;
      }, function () { /* status already says so */ });
    }
    input.addEventListener("focus", function () { ensure().catch(function () {}); });
    input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(render, 90); });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowDown") { ev.preventDefault(); setActive(active + 1); }
      else if (ev.key === "ArrowUp") { ev.preventDefault(); setActive(active - 1); }
      else if (ev.key === "Enter") {
        const hits = list.querySelectorAll(".ss-hit");
        const h = hits[active >= 0 ? active : 0];
        if (h) { ev.preventDefault(); window.location.href = h.getAttribute("href"); }
      } else if (ev.key === "Escape") { input.value = ""; render(); input.blur(); }
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "/" || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      const t = (ev.target && ev.target.tagName) || "";
      if (t === "INPUT" || t === "TEXTAREA") return;
      ev.preventDefault();
      input.focus();
    });
  }

  /* Loads script files one after another (works from file://, unlike fetch). */
  function loadScripts(urls) {
    return urls.reduce(function (p, url) {
      return p.then(function () {
        return new Promise(function (resolve, reject) {
          const s = document.createElement("script");
          s.src = url;
          s.onload = resolve;
          s.onerror = function () { reject(new Error("could not load " + url)); };
          document.head.appendChild(s);
        });
      });
    }, Promise.resolve());
  }

  window.StudySearch = { mount: mount, loadScripts: loadScripts, clean: clean, buildIndex: buildIndex, search: search, words: words };
})();
