/* ============================================================
   SASEBO LIGHTS FESTIVAL 2026 — site.js
   仕様書 6章(カウントダウン) / 7章(支援メーター) / 11章(出店者)
   16章(FAQ) / 18章(Motion) / 20章(A11y) の挙動を実装
   ============================================================ */
(function () {
  "use strict";

  var D = window.SCM || {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- utils ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function yen(n) { return "¥" + Number(n).toLocaleString("ja-JP"); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  /* ============================================================
     1. 緊急告知バナー（全ページ同期／仕様書15章）
     ============================================================ */
  function renderAlert() {
    var host = $("#alert");
    if (!host || !D.emergency || !D.emergency.show) return;
    var e = D.emergency;
    var link = e.linkUrl ? ' <a href="' + esc(e.linkUrl) + '">' + esc(e.linkText || "詳細") + "</a>" : "";
    host.innerHTML =
      '<div class="alert" data-level="' + esc(e.level) + '" role="status">' +
      '<span class="alert__tag">' + esc(e.tag || "NOTICE") + "</span>" +
      esc(e.text) + link + "</div>";
    measureAlert();
  }

  /* 固定トップバーの高さをCSS変数へ反映（バナーの行数が変わっても崩れない） */
  function measureAlert() {
    var bar = $("#alert");
    var set = function () {
      var h = bar ? bar.offsetHeight : 0;
      document.documentElement.style.setProperty("--alert-h", h + "px");
    };
    set();
    window.addEventListener("resize", set);
    if (window.ResizeObserver && bar) new ResizeObserver(set).observe(bar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(set);
  }

  /* ============================================================
     2. ヘッダー / ドロワー
     ============================================================ */
  function initHeader() {
    var hd = $(".hd");
    if (hd && !hd.classList.contains("is-solid")) {
      var onScroll = function () {
        hd.classList.toggle("is-scrolled", window.scrollY > 80);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var burger = $(".burger"), drawer = $("#drawer");
    if (!burger || !drawer) return;
    var close = $(".drawer__close", drawer);

    function setOpen(open) {
      drawer.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.documentElement.style.overflow = open ? "hidden" : "";
      if (open) { var f = $(".drawer__link", drawer); if (f) f.focus(); }
      else burger.focus();
    }
    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    if (close) close.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && drawer.classList.contains("is-open")) setOpen(false);
    });
    $$(".drawer__link", drawer).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
  }

  /* 現在ページをナビに反映 */
  function markCurrent() {
    var here = location.pathname.split("/").pop() || "index.html";
    $$("[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page") === here) a.setAttribute("aria-current", "page");
    });
  }

  /* ============================================================
     3. カウントダウン（仕様書6章／JST固定）
     ============================================================ */
  function initCountdown() {
    var root = $("#countdown");
    if (!root || !D.event) return;

    var target = new Date(D.event.targetISO).getTime();
    if (isNaN(target)) return;

    var grid = $(".cd__grid", root);
    var msg = $(".cd__msg", root);
    var units = [
      { k: "d", label: "DAYS" }, { k: "h", label: "HOURS" },
      { k: "m", label: "MINUTES" }, { k: "s", label: "SECONDS" }
    ];

    if (D.event.fireworksStatus === "canceled") {
      showMessage("花火は中止となりました");
      return;
    }

    grid.innerHTML = units.map(function (u) {
      return '<div class="cd__unit"><div class="cd__val" data-u="' + u.k + '"><span>--</span></div>' +
        "<small>" + u.label + "</small></div>";
    }).join("");

    var cells = {};
    units.forEach(function (u) { cells[u.k] = $('[data-u="' + u.k + '"]', grid); });

    function showMessage(text) {
      grid.style.display = "none";
      var lbl = $(".cd__label", root); if (lbl) lbl.style.display = "none";
      msg.textContent = text;
      msg.hidden = false;
    }

    function setCell(el, val) {
      var next = String(val).padStart(2, "0");
      var cur = el.firstElementChild;
      if (cur && cur.textContent === next) return;
      if (reduced || !cur) { el.innerHTML = "<span>" + next + "</span>"; return; }
      cur.classList.add("tick-out");
      var span = document.createElement("span");
      span.textContent = next;
      span.className = "tick-in";
      el.appendChild(span);
      setTimeout(function () { if (cur.parentNode === el) el.removeChild(cur); }, 180);
    }

    /* JSTでの日付文字列（当日判定用） */
    function jstDay(ms) {
      return new Date(ms + 9 * 3600 * 1000).toISOString().slice(0, 10);
    }

    function tick() {
      var now = Date.now();
      var diff = target - now;

      if (diff <= -60 * 60 * 1000) { showMessage("ご来場ありがとうございました"); return true; }
      if (diff <= 0) { showMessage("まもなく冬花火"); return false; }
      if (diff <= 30 * 60 * 1000) { showMessage("まもなく冬花火"); return false; }
      if (jstDay(now) === jstDay(target)) { showMessage("本日開催"); return false; }

      var s = Math.floor(diff / 1000);
      setCell(cells.d, Math.floor(s / 86400));
      setCell(cells.h, Math.floor(s % 86400 / 3600));
      setCell(cells.m, Math.floor(s % 3600 / 60));
      setCell(cells.s, s % 60);
      return false;
    }

    if (!tick()) {
      var id = setInterval(function () { if (tick()) clearInterval(id); }, 1000);
    }
  }

  /* ============================================================
     4. 冬花火メーター（サイトのシグネチャ／仕様書7章）
        支援率のぶんだけ花火の光条が描かれる
     ============================================================ */
  var RAYS = 40;

  function buildFirework(host) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 400 400");
    svg.setAttribute("aria-hidden", "true");

    var gGuide = document.createElementNS(NS, "g");
    var gRay = document.createElementNS(NS, "g");

    for (var i = 0; i < RAYS; i++) {
      var a = (Math.PI * 2 * i / RAYS) - Math.PI / 2;
      var len = 128 + ((i * 37) % 11) * 4.4;      // 光条の長さに揺らぎ
      var x1 = 200 + Math.cos(a) * 74, y1 = 200 + Math.sin(a) * 74;
      var x2 = 200 + Math.cos(a) * len, y2 = 200 + Math.sin(a) * len;

      var guide = document.createElementNS(NS, "line");
      guide.setAttribute("x1", x1); guide.setAttribute("y1", y1);
      guide.setAttribute("x2", x2); guide.setAttribute("y2", y2);
      guide.setAttribute("stroke", "rgba(246,241,231,0.11)");
      guide.setAttribute("stroke-width", "1.4");
      guide.setAttribute("stroke-linecap", "round");
      gGuide.appendChild(guide);

      var ray = document.createElementNS(NS, "line");
      ray.setAttribute("x1", x1); ray.setAttribute("y1", y1);
      ray.setAttribute("x2", x2); ray.setAttribute("y2", y2);
      ray.setAttribute("stroke", i % 7 === 0 ? "#E0C285" : "#C7A45A");
      ray.setAttribute("stroke-width", i % 5 === 0 ? "2.2" : "1.6");
      ray.setAttribute("stroke-linecap", "round");
      ray.setAttribute("pathLength", "1");
      ray.setAttribute("stroke-dasharray", "1");
      ray.setAttribute("stroke-dashoffset", "1");
      ray.setAttribute("class", "fw-ray");
      ray.style.transitionDelay = (i * 12) + "ms";
      gRay.appendChild(ray);
    }

    var core = document.createElementNS(NS, "circle");
    core.setAttribute("cx", "200"); core.setAttribute("cy", "200");
    core.setAttribute("r", "64"); core.setAttribute("fill", "none");
    core.setAttribute("stroke", "rgba(199,164,90,.22)");
    core.setAttribute("stroke-width", "1");
    core.setAttribute("stroke-dasharray", "2 6");

    svg.appendChild(gGuide);
    svg.appendChild(gRay);
    svg.appendChild(core);
    host.appendChild(svg);
    return gRay;
  }

  function initMeter() {
    var root = $("#meter");
    if (!root || !D.funding) return;

    var f = D.funding;
    var goal = f.goalAmount, current = f.currentAmount;
    var pct = goal > 0 ? current / goal : 0;

    var art = $(".meter__art", root);
    var rays = art ? buildFirework(art) : null;
    var fill = $(".rail__fill", root);
    var rail = $(".rail", root);
    var nowEl = $(".meter__now", root);
    var pctEl = $(".meter__pct", root);
    var goalEl = $(".meter__goal", root);
    var restEl = $("#fundRest");
    var supEl = $("#fundSupporters");
    var comEl = $("#fundCompanies");
    var updEl = $("#fundUpdated");

    if (goalEl) goalEl.textContent = "/ 目標 " + yen(goal);
    if (supEl) supEl.innerHTML = Number(f.supporterCount).toLocaleString("ja-JP") + "<em>名</em>";
    if (comEl) comEl.innerHTML = Number(f.companyCount).toLocaleString("ja-JP") + "<em>社</em>";
    if (updEl) updEl.textContent = f.updatedAt;
    if (restEl) {
      var rest = goal - current;
      restEl.innerHTML = rest > 0 ? yen(rest) : "達成";
    }
    if (rail) {
      rail.setAttribute("role", "progressbar");
      rail.setAttribute("aria-valuemin", "0");
      rail.setAttribute("aria-valuemax", "100");
      rail.setAttribute("aria-valuenow", String(Math.round(pct * 100)));
      rail.setAttribute("aria-label", "冬花火の支援達成率");
    }
    if (pct >= 1) root.classList.add("is-complete");

    var played = false;
    function play(to) {
      /* 光条を支援率ぶんだけ描く */
      if (rays) {
        for (var i = 0; i < rays.children.length; i++) {
          var t = Math.max(0, Math.min(1, to * RAYS - i));
          rays.children[i].style.strokeDashoffset = String(1 - t);
        }
      }
      if (fill) fill.style.width = Math.min(100, to * 100) + "%";
      countUp(to);
    }

    function countUp(to) {
      var dur = reduced ? 0 : 1000, t0 = performance.now();
      function frame(now) {
        var p = dur ? Math.min(1, (now - t0) / dur) : 1;
        var e = ease(p);
        if (nowEl) nowEl.textContent = yen(Math.round(current * e));
        if (pctEl) pctEl.innerHTML = Math.round(to * 100 * e) + "<sub>%</sub>";
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    function start() {
      if (played) return;
      played = true;
      if (reduced) { play(pct); return; }
      setTimeout(function () { play(pct); }, 120);
      if (document.body.dataset.demoToast === "on") {
        setTimeout(function () { demoSupport(); }, 4200);
      }
    }

    /* 新規支援の演出（仕様書7.2）: 実装時はWebhook確定イベントで呼ぶ */
    function demoSupport() {
      var add = 3000;
      current += add;
      pct = Math.min(1.4, current / goal);
      play(pct);
      if (rail) rail.setAttribute("aria-valuenow", String(Math.round(pct * 100)));
      toast("新しい応援が届きました　" + yen(add));
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es, o) {
        es.forEach(function (en) { if (en.isIntersecting) { start(); o.disconnect(); } });
      }, { threshold: 0.35 }).observe(root);
    } else start();
  }

  function toast(text) {
    var el = $("#toast");
    if (!el) return;
    el.innerHTML = '<span class="toast__tag">NEW SUPPORT</span>' + esc(text);
    el.classList.add("is-on");
    setTimeout(function () { el.classList.remove("is-on"); }, 4000);
  }

  /* ============================================================
     5. スクロールリビール（仕様書18章 Section 400-550ms）
     ============================================================ */
  function initReveal() {
    var items = $$(".rv");
    if (!items.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var i = Number(el.dataset.rvI || 0);
        el.style.transitionDelay = Math.min(i * 40, 240) + "ms";
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================
     6. 各ページのコンテンツ描画
     ============================================================ */

  /* 開催情報テキストの差し込み */
  function fillEvent() {
    var e = D.event || {}, s = D.site || {};
    var map = {
      "js-date": e.dateLabel, "js-date-short": e.dateShort, "js-venue": e.venue,
      "js-open": e.openLabel, "js-admission": e.admission, "js-fireworks-time": e.fireworksTime,
      "js-address": e.venueAddress, "js-organizer": s.organizer, "js-contact": s.contactEmail,
      "js-sample-notice": s.sampleNotice, "js-use-of-funds": (D.funding || {}).useOfFunds
    };
    Object.keys(map).forEach(function (k) {
      if (map[k] == null) return;
      $$("." + k).forEach(function (el) { el.textContent = map[k]; });
    });
    $$(".js-map-link").forEach(function (a) { a.href = e.mapUrl; });
    if (!e.dateConfirmed) {
      $$(".js-provisional").forEach(function (el) { el.hidden = false; });
    }
    $$(".js-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* 指標（ABOUT） */
  function renderFigures() {
    var host = $("#figures");
    if (!host || !D.figures) return;
    host.innerHTML = D.figures.map(function (f, i) {
      return '<dl class="fig rv" data-rv-i="' + i + '"><dt>' + esc(f.label) + "</dt>" +
        '<dd class="num">' + esc(f.value) + "<em>" + esc(f.unit) + "</em></dd></dl>";
    }).join("");
  }

  /* 当日の時間割（TOPの主要セクション） */
  function renderTimeline() {
    var host = $("#timeline");
    if (!host || !D.timeline) return;
    host.innerHTML = D.timeline.map(function (t, i) {
      return '<article class="tl__item rv" data-rv-i="' + i + '">' +
        '<div class="tl__media"><img src="' + esc(t.img) + '" alt="' + esc(t.alt) +
          '" loading="lazy" width="1400" height="875"></div>' +
        "<div>" +
          '<p class="clock">' + esc(t.time) + "</p>" +
          '<h3 class="h2 tl__title"><span class="en">' + esc(t.en) + "</span>" + esc(t.title) + "</h3>" +
          '<p class="tl__text">' + esc(t.text) + "</p>" +
          '<p class="mt-m"><a class="tlink" href="' + esc(t.link) + '">' + esc(t.linkText) +
            '<span class="btn__arrow">&#8594;</span></a></p>' +
        "</div></article>";
    }).join("");
  }

  /* 出店者（仕様書11章） */
  function renderVendors() {
    var host = $("#vendors");
    if (!host || !D.vendors) return;
    var limit = Number(host.dataset.limit || 0);
    var tabsHost = $("#vendorTabs");

    function draw(key) {
      var list = D.vendors.filter(function (v) {
        return key === "all" || v.cat === key;
      });
      if (limit) list = list.slice(0, limit);
      host.innerHTML = list.map(function (v, i) {
        return '<article class="card rv" data-rv-i="' + i + '">' +
          '<div class="card__media">' +
            (v.local ? '<span class="badge badge--local card__tag">佐世保市の店</span>' : "") +
            '<img src="' + esc(v.img) + '" alt="' + esc(v.name) + 'の出店イメージ" loading="lazy" width="1200" height="900">' +
          "</div>" +
          '<div class="card__body">' +
            '<p class="card__cat">' + esc(v.catLabel) + "</p>" +
            '<h3 class="h4">' + esc(v.name) + "</h3>" +
            '<p class="card__desc">' + esc(v.desc) + "</p>" +
            '<p class="card__foot">' + esc(v.area) + "</p>" +
          "</div></article>";
      }).join("");
      initReveal();
    }

    if (tabsHost && D.vendorCategories) {
      tabsHost.innerHTML = D.vendorCategories.map(function (c, i) {
        return '<button type="button" class="tab" role="tab" data-cat="' + esc(c.key) + '" aria-selected="' +
          (i === 0) + '">' + esc(c.label) + "</button>";
      }).join("");
      $$(".tab", tabsHost).forEach(function (b) {
        b.addEventListener("click", function () {
          $$(".tab", tabsHost).forEach(function (x) { x.setAttribute("aria-selected", "false"); });
          b.setAttribute("aria-selected", "true");
          draw(b.dataset.cat);
        });
      });
    }
    draw("all");
  }

  /* チケット（仕様書10章） */
  function renderTickets() {
    var host = $("#tickets");
    if (!host || !D.tickets) return;
    host.innerHTML = D.tickets.map(function (t, i) {
      var rate = t.capacity ? t.sold / t.capacity : 0;
      var state, cls, label;
      if (rate >= 1) { state = "out"; cls = "stock--out"; label = "SOLD OUT"; }
      else if (rate > 0.9) { state = "low"; cls = "stock--low"; label = "残り" + (t.capacity - t.sold) + "席"; }
      else if (rate > 0.7) { state = "few"; cls = "stock--low"; label = "残りわずか"; }
      else { state = "ok"; cls = ""; label = "残席あり"; }

      return '<article class="plan rv' + (t.feature ? " plan--feature" : "") + '" data-rv-i="' + i + '">' +
        '<h3 class="plan__name">' + esc(t.name) + "</h3>" +
        '<p class="plan__price num">' + yen(t.price) + "<small>/ " + esc(t.unit) + "</small></p>" +
        '<ul class="plan__list">' + t.value.map(function (v) { return "<li>" + esc(v) + "</li>"; }).join("") + "</ul>" +
        '<div class="stock ' + cls + '"><span>' + esc(label) + "</span>" +
          '<span class="stock__bar"><i style="width:' + Math.min(100, rate * 100) + '%"></i></span></div>' +
        '<div class="plan__foot">' +
          (state === "out"
            ? '<span class="btn btn--outline btn--block" aria-disabled="true">SOLD OUT</span>'
            : '<a class="btn btn--primary btn--block" href="ticket.html">席を選ぶ<span class="btn__arrow">&#8594;</span></a>') +
        "</div></article>";
    }).join("");
  }

  /* 個人支援プラン（仕様書8.1） */
  function renderSupportPlans() {
    var host = $("#supportPlans");
    if (!host || !D.supportPlans) return;
    host.innerHTML = D.supportPlans.map(function (p, i) {
      return '<article class="plan rv' + (p.feature ? " plan--feature" : "") + '" data-rv-i="' + i + '">' +
        '<h3 class="plan__name">' + esc(p.name) + "</h3>" +
        '<p class="plan__price num">' + (p.price ? yen(p.price) : "自由金額") + "</p>" +
        '<ul class="plan__list">' + p.items.map(function (v) { return "<li>" + esc(v) + "</li>"; }).join("") + "</ul>" +
        '<div class="plan__foot"><a class="btn btn--support btn--block" href="support.html#form">この金額で応援する</a></div>' +
        "</article>";
    }).join("");
  }

  /* 企業協賛枠（仕様書8.3） */
  function renderSponsorTiers() {
    var host = $("#sponsorTiers");
    if (!host || !D.sponsorTiers) return;
    host.innerHTML =
      "<thead><tr><th>枠</th><th>金額</th><th>主な内容</th><th>申込</th><th>協賛</th></tr></thead><tbody>" +
      D.sponsorTiers.map(function (t) {
        var online = t.price <= 100000;
        /* 未決の枠は空欄にせず「募集中」を出す（列を常に見せるため） */
        var sponsors = t.sponsors || [];
        var sponsorCell = sponsors.length
          ? sponsors.map(esc).join("<br>")
          : '<span class="tbl__open">募集中</span>';
        return "<tr><th scope=\"row\">" + esc(t.tier) + (t.limit ? ' <span class="badge badge--gold">' + esc(t.limit) + "</span>" : "") + "</th>" +
          '<td data-l="AMOUNT" class="num">' + yen(t.price) + "</td>" +
          '<td data-l="BENEFITS">' + t.items.map(esc).join(" / ") + "</td>" +
          '<td data-l="HOW">' + (online ? "オンライン申込 / 問い合わせ" : "資料請求・問い合わせ") + "</td>" +
          '<td data-l="SPONSOR" class="tbl__sponsor">' + sponsorCell + "</td></tr>";
      }).join("") + "</tbody>";
  }

  /* 協賛レール：TOPの右端に固定して常時表示する縦帯（仕様書13章）
     枠ごとに1行。決まっていない枠は空欄にせず「募集中」を出す。 */
  function renderSponsorRail() {
    var host = $("#sponsorRail");
    if (!host || !D.sponsorTiers) return;
    host.innerHTML =
      '<p class="srail__ttl" id="srailTtl">Supported by</p>' +
      '<ul class="srail__list">' +
      D.sponsorTiers.map(function (t) {
        var sponsors = t.sponsors || [];
        var body = sponsors.length
          ? sponsors.map(function (n) { return '<span class="srail__name">' + esc(n) + "</span>"; }).join("")
          : '<span class="srail__open">募集中</span>';
        return '<li class="srail__item"><span class="srail__tier">' + esc(t.tier) + "</span>" + body + "</li>";
      }).join("") +
      "</ul>" +
      '<a class="srail__cta" href="support.html#company">協賛について<span aria-hidden="true">&#8594;</span></a>';
    host.hidden = false;
  }

  /* 協賛一覧（仕様書13章） */
  function renderPartners() {
    var host = $("#partners");
    if (!host || !D.partners) return;
    var p = D.partners;

    /* TOPでは階層を省いて1列にまとめる（空の枠が並んで見えないように） */
    if (host.dataset.compact === "on") {
      var flat = [].concat(p.main || [], p.premium || [], p.regional || [], p.local || []);
      host.innerHTML = '<div class="logos logos--md rv">' +
        flat.map(function (c) {
          return '<a class="logo-card" href="' + esc(c.url) + '"><img src="' + esc(c.logo) +
            '" alt="' + esc(c.name) + '" loading="lazy" width="360" height="120"></a>';
        }).join("") +
        '<a class="logo-card logo-card--open" href="support.html#company">協賛枠 募集中</a>' +
        "</div>";
      return;
    }

    var tiers = [
      { key: "main", name: "MAIN PARTNER", note: "1社限定", cls: "logos--main" },
      { key: "premium", name: "PREMIUM PARTNER", note: "", cls: "logos--lg" },
      { key: "regional", name: "REGIONAL PARTNER", note: "", cls: "logos--md" },
      { key: "local", name: "LOCAL SUPPORTERS", note: "", cls: "logos--sm" }
    ];
    var html = tiers.map(function (t) {
      var list = p[t.key] || [];
      var inner;
      if (list.length) {
        inner = list.map(function (c) {
          return '<a class="logo-card" href="' + esc(c.url) + '"><img src="' + esc(c.logo) +
            '" alt="' + esc(c.name) + '" loading="lazy" width="360" height="120"></a>';
        }).join("");
      } else if (t.key === "main") {
        /* 未決定の枠は空白にせず、募集中として見せる */
        inner = '<a class="logo-card logo-card--open" href="support.html#company">' +
          esc(t.name) + " 募集中</a>";
      } else {
        return "";
      }
      return '<div class="tier rv">' +
        '<div class="tier__head"><h3 class="tier__name">' + esc(t.name) + "</h3>" +
        (t.note ? '<span class="tier__note">' + esc(t.note) + "</span>" : "") + "</div>" +
        '<div class="logos ' + t.cls + '">' + inner + "</div></div>";
    }).join("");
    /* ロゴなしでお名前のみ掲載する企業・団体（参考サイトと同じ二段構え） */
    html += '<div class="tier rv"><div class="tier__head">' +
      '<h3 class="tier__name">SUPPORTING COMPANIES</h3>' +
      '<span class="tier__note">協賛企業・団体　' + esc(p.namesNote || "") + "</span></div>";
    if (p.names && p.names.length) {
      html += '<ul class="names names--cols">' +
        p.names.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>";
    } else {
      html += '<p class="names">' + esc(p.namesEmpty || "決定次第、掲載します。") + "</p>";
    }
    html += "</div>";

    if (p.individual && p.individual.length) {
      html += '<div class="tier rv"><div class="tier__head"><h3 class="tier__name">INDIVIDUAL SUPPORTERS</h3>' +
        '<span class="tier__note">個人サポーター　※掲載を希望された方のみ</span></div>' +
        '<p class="names">' + p.individual.map(esc).join(" ／ ") + "</p></div>";
    }
    host.innerHTML = html;
  }

  /* ニュース（仕様書15章） */
  function renderNews() {
    var host = $("#news");
    if (!host || !D.news) return;
    var limit = Number(host.dataset.limit || 0);
    var list = limit ? D.news.slice(0, limit) : D.news;
    host.innerHTML = list.map(function (n, i) {
      var cls = n.cat === "IMPORTANT" ? "badge--red" : "badge--gold";
      return '<article class="news__item rv" data-rv-i="' + i + '">' +
        '<div class="news__meta"><time class="news__date">' + esc(n.date) + "</time>" +
        '<span class="badge ' + cls + '">' + esc(n.cat) + "</span></div>" +
        '<div><h3 class="news__title">' + esc(n.title) + "</h3>" +
        '<p class="news__body">' + esc(n.body) + "</p></div></article>";
    }).join("");
  }

  /* FAQ（仕様書16章 / 複数同時Open可） */
  function renderFaq() {
    var host = $("#faq");
    if (!host || !D.faq) return;
    var limit = Number(host.dataset.limit || 0);
    var list = limit ? D.faq.slice(0, limit) : D.faq;
    host.innerHTML = list.map(function (f, i) {
      var id = "faq-" + i;
      return '<div class="faq__item">' +
        '<button type="button" class="faq__q" aria-expanded="false" aria-controls="' + id + '">' +
        esc(f.q) + '<span class="faq__mark" aria-hidden="true"></span></button>' +
        '<div class="faq__a" id="' + id + '"><div><p>' + esc(f.a) + "</p></div></div></div>";
    }).join("");

    $$(".faq__q", host).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        btn.parentNode.classList.toggle("is-open", !open);
      });
    });
  }

  /* アクセス（仕様書14章） */
  function renderAccess() {
    var a = D.access;
    if (!a) return;
    function fill(id, rows) {
      var host = $(id);
      if (!host || !rows) return;
      host.innerHTML = rows.map(function (r) {
        return "<dt>" + esc(r.label) + "</dt><dd>" + esc(r.text) + "</dd>";
      }).join("");
    }
    fill("#accessTransit", a.transit);
    fill("#accessCar", a.car);
  }

  /* フッター法務リンク */
  function renderLegal() {
    var host = $("#legalLinks");
    if (!host || !D.legal) return;
    host.innerHTML = D.legal.map(function (l) {
      return '<a href="' + esc(l.url) + '">' + esc(l.label) + "</a>";
    }).join("");
  }

  /* メッセージ花火（仕様書9章） */
  function renderMessageFirework() {
    var host = $("#msgFirework");
    if (!host || !D.messageFirework) return;
    var m = D.messageFirework;
    host.innerHTML =
      '<p class="plan__price num">' + yen(m.price) + "</p>" +
      '<ul class="plan__list">' +
      "<li>タイトル" + m.titleLimit + "字 / 本文" + m.bodyLimit + "字程度</li>" +
      "<li>申込締切：" + esc(m.deadline) + "</li>" +
      "<li>掲載内容は運営で確認します</li></ul>" +
      '<p class="note mt-s">' + esc(m.note) + "</p>";
  }

  /* ヘッダー右上の固定ボタン（2行） */
  function renderHeaderCta() {
    var el = $("#hdCta"), c = D.headerCta;
    if (!el || !c) return;
    el.href = c.url || "support.html";
    el.innerHTML = '<span class="hd__cta-sub">' + esc(c.sub) + "</span>" +
      '<span class="hd__cta-main">' + esc(c.main) + "</span>";
  }

  /* ご来場にあたっての注意事項 */
  function renderNotices() {
    var host = $("#notice"), n = D.notices;
    if (!host || !n) return;
    host.innerHTML = '<p class="notice__ttl">' + esc(n.title) + "</p><ul>" +
      n.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
  }

  /* 開催地について（出典つきの数値） */
  function renderRegion() {
    var host = $("#region");
    if (!host || !D.region) return;
    host.innerHTML = D.region.map(function (r, i) {
      return '<dl class="fig rv" data-rv-i="' + i + '"><dt>' + esc(r.label) + "</dt>" +
        '<dd class="num">' + esc(r.value) + "</dd>" +
        '<dd class="fig__note">' + esc(r.note) + "</dd></dl>";
    }).join("");
    var src = $("#regionSource");
    if (src) src.textContent = D.regionSource || "";
  }

  /* 実行委員会 / 主催・後援・協力 */
  function renderOrg() {
    function fill(id, rows, k1, k2) {
      var host = $(id);
      if (!host || !rows) return;
      host.innerHTML = rows.map(function (r) {
        return "<dt>" + esc(r[k1]) + "</dt><dd>" + esc(r[k2]) + "</dd>";
      }).join("");
    }
    fill("#committee", D.committee, "role", "name");
    fill("#credits", D.credits, "label", "value");
  }

  /* ============================================================
     7. Hero 起動
     ============================================================ */
  function initHero() {
    var hero = $(".hero");
    if (!hero) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add("is-ready"); });
    });
  }

  /* ヒーロー動画（仕様書20章：停止手段を必ず用意する） */
  function initHeroVideo() {
    var v = $(".hero__video"), btn = $("#heroToggle");
    if (!v || !v.dataset.src) return;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (reduced || saveData || window.innerWidth < 768) return;   // 静止画のまま

    v.src = v.dataset.src;
    v.addEventListener("playing", function () {
      v.classList.add("is-on");
      if (btn) btn.hidden = false;
    }, { once: true });

    var play = v.play();
    if (play && play.catch) play.catch(function () { /* 自動再生が許可されない場合は静止画のまま */ });

    if (!btn) return;
    var label = $(".hero__toggle-label", btn);
    btn.addEventListener("click", function () {
      if (v.paused) {
        v.play();
        btn.setAttribute("aria-pressed", "false");
        label.textContent = "動画を停止";
      } else {
        v.pause();
        btn.setAttribute("aria-pressed", "true");
        label.textContent = "動画を再生";
      }
    });
  }

  /* ============================================================
     8. 起動
     ============================================================ */
  function boot() {
    renderAlert();
    renderHeaderCta();
    initHeader();
    markCurrent();
    fillEvent();
    renderFigures();
    renderTimeline();
    renderVendors();
    renderTickets();
    renderSupportPlans();
    renderSponsorTiers();
    renderSponsorRail();
    renderPartners();
    renderNews();
    renderFaq();
    renderAccess();
    renderLegal();
    renderMessageFirework();
    renderNotices();
    renderRegion();
    renderOrg();
    initHero();
    initHeroVideo();
    initCountdown();
    initMeter();
    initReveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
