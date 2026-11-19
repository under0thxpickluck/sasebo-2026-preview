/* 試算ページ（plan.html）。data.js の plan ブロックを表に起こすだけ。
 *
 * **数字をここに書かない。** 画面側に書くと data.js と二重管理になり、
 * 片方だけ直したときに、どちらが正なのか誰にも分からなくなる。
 *
 * data.plan が無いときは**節ごと隠す**。空の表や 0 を出すと、
 * 「試算した結果ゼロ」と読めてしまう。出せないことと、ゼロは別物。
 *
 * 2026-11-11 改訂。ラベル（実績／仮置／目標／未算出）を足した。
 * **色だけで分けない。** 白黒で印刷しても、読み上げでも区別がつくように、
 * 文字そのものをラベルにする。
 */
(function () {
  "use strict";

  var D = window.SCM || {};
  var P = D.plan;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /** 文中の **ここ** だけを太字にする。他のしるしは効かせない */
  function strong(v) {
    return esc(v).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  }

  /** ラベル。実績か、仮置きか、目標か、まだ出せないのか */
  function tag(name) {
    if (!name) return "";
    var kind = { "実績": "fact", "仮置": "draft", "目標": "goal", "検討中": "none" }[name] || "draft";
    return '<span class="plan-tag plan-tag--' + kind + '">' + esc(name) + "</span>";
  }

  /** 削れるかの印。色に頼らず、文字そのもので区別がつくようにする */
  function cutMark(v) {
    if (v === "×") return '<span class="plan-cut plan-cut--no">削減不可</span>';
    if (v === "△") return '<span class="plan-cut plan-cut--care">一部調整可</span>';
    return '<span class="plan-cut">削減可</span>';
  }

  /** 表を描く。rows が空なら、その表を載せている節ごと隠す */
  function fill(tableId, rows, toCells) {
    var table = document.getElementById(tableId);
    if (!table) return;
    var section = table.closest ? table.closest(".section") : null;
    if (!rows || !rows.length) {
      if (section) section.hidden = true;
      return;
    }
    $("tbody", table).innerHTML = rows.map(function (row) {
      var cells = toCells(row);
      var tr = cells.map(function (cell, i) {
        /* 1列目は見出し。読み上げのときに、どの行の値かが分かる */
        return i === 0
          ? '<th scope="row">' + cell + "</th>"
          : "<td>" + cell + "</td>";
      }).join("");
      /* 基準・合計の行は太く。表の中で「どれを見ればいいか」を1行だけ示す */
      return "<tr" + (row.strong ? ' class="is-strong"' : "") + ">" + tr + "</tr>";
    }).join("");
  }

  /** 箇条書き。空なら、その塊ごと隠す */
  function list(id, items, toHtml) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!items || !items.length) { el.hidden = true; return; }
    el.innerHTML = items.map(function (it) {
      return "<li>" + toHtml(it) + "</li>";
    }).join("");
  }

  function text(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || "—";
  }

  function init() {
    if (!P) {
      /* 試算そのものが無い。節を消して、見出しだけが残らないようにする */
      ["scale", "budget", "income", "sponsor", "scenario",
       "gonogo", "branch", "marketing", "flow", "timetable", "security"].forEach(function (id) {
        var s = document.getElementById(id);
        if (s) s.hidden = true;
      });
      return;
    }

    text("planStatus", P.status);
    text("planCaution", P.caution);
    text("planSource", P.source);
    text("planUpdated", P.updated);

    /* ── 過去の実績。比べる相手として置くが、予測には使わない ── */
    text("planHistoryNote", P.historyNote);
    fill("planHistory", P.history, function (r) {
      return [esc(r.year) + " " + esc(r.event), esc(r.figure) + " " + tag("実績"), esc(r.note)];
    });

    /* ── 規模 ── */
    text("planScaleNote", P.scaleNote);
    fill("planScale", P.scale, function (r) {
      return [esc(r.label), esc(r.conservative), esc(r.base), esc(r.high), esc(r.note)];
    });

    /* ── 支出 ── */
    text("planBudgetTotal", P.budgetTotal);
    text("planBudgetNote", P.budgetNote);
    fill("planBudget", P.budget, function (r) {
      return [esc(r.item), esc(r.amount) + " " + tag(r.tag), cutMark(r.cut), esc(r.note)];
    });
    fill("planBudgetMissing", P.budgetMissing, function (r) {
      return [esc(r.item), esc(r.state), esc(r.note)];
    });

    /* ── 収入 ── */
    text("planIncomeTotal", P.incomeTotal);
    text("planIncomeBase", P.incomeBase);
    var noteEl = document.getElementById("planIncomeNote");
    if (noteEl) noteEl.innerHTML = strong(P.incomeNote);
    fill("planIncome", P.income, function (r) {
      return [esc(r.item), esc(r.unit), esc(r.amount) + " " + tag(r.tag), esc(r.when)];
    });

    /* ── 協賛。**提案価格であって入金ではない** ── */
    text("planSponsorTotal", P.sponsorTotal);
    text("planSponsorStatus", P.sponsorStatus);
    text("planSponsorNote", P.sponsorNote);
    fill("planSponsorMenu", P.sponsorMenu, function (r) {
      return [esc(r.rank), esc(r.price), esc(r.count), esc(r.total) + " " + tag(r.tag)];
    });

    /* ── 損益 ── */
    text("planBreakeven", P.breakeven);
    text("planScenarioNote", P.scenarioNote);
    fill("planScenario", P.scenarios, function (r) {
      return [esc(r.name), esc(r.visitors), esc(r.ticket), esc(r.stall),
              esc(r.nonsponsor), esc(r.sponsor), esc(r.profit), esc(r.judge)];
    });
    fill("planSponsorLanding", P.sponsor, function (r) {
      return [esc(r.amount), esc(r.landing)];
    });

    /* ── GO / NO-GO ── */
    text("planGonogoNote", P.gonogoNote);
    fill("planGonogo", P.gonogo, function (r) {
      return [esc(r.when), esc(r.check), esc(r.stop)];
    });

    /* ── 分岐 A / B / C ── */
    fill("planBranch", P.plans, function (r) {
      return [esc(r.name), esc(r.cond), esc(r.note)];
    });

    /* ── 追加企画 ── */
    text("planMarketingNote", P.marketingNote);
    fill("planMarketing", P.marketing, function (r) {
      return [esc(r.name), esc(r.when), esc(r.cost), esc(r.note)];
    });

    /* ── 導線 ── */
    text("planFlowRule", P.flowRule);
    fill("planFlow", P.flow, function (r) {
      var no = r.no ? '<span class="plan-no">' + esc(r.no) + "</span> " : "";
      return [no + esc(r.phase), esc(r.move), strong(r.watch)];
    });

    /* ── 時間割 ── */
    text("planTimetableNote", P.timetableNote);
    fill("planTimetable", P.timetable, function (r) {
      return ['<b class="plan-time">' + esc(r.time) + "</b>", esc(r.guest), esc(r.staff)];
    });

    /* ── 警備 ── */
    text("planSecurityBasis", P.securityBasis);
    text("planSecurityPeak", P.securityPeak);
    fill("planSecurity", P.security, function (r) {
      return [esc(r.spot), esc(r.why)];
    });
    list("planSecurityTodo", P.securityTodo, esc);

    text("planMapNote", P.mapNote);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
