/* 試算ページ（plan.html）。data.js の plan ブロックを画面に起こすだけ。
 *
 * **数字をここに書かない。** 画面側に書くと data.js と二重管理になり、
 * 片方だけ直したときに、どちらが正なのか誰にも分からなくなる。
 *
 * data.plan が無いときは**節ごと隠す**。空の表や 0 を出すと
 * 「試算した結果ゼロ」と読めてしまう。出せないことと、ゼロは別物。
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

  /** ラベル。仮置きか、まだ出せないのか */
  function tag(name) {
    if (!name) return "";
    var kind = { "実績": "fact", "仮置": "draft", "目標": "goal", "未算出": "none" }[name] || "draft";
    return '<span class="plan-tag plan-tag--' + kind + '">' + esc(name) + "</span>";
  }

  /** 削れるかの印。**色に頼らず、文字そのもので区別がつくように** */
  function cutMark(v) {
    if (v === "×") return '<span class="plan-cut plan-cut--no">削れない</span>';
    if (v === "△") return '<span class="plan-cut plan-cut--care">一部だけ</span>';
    return '<span class="plan-cut">削れる</span>';
  }

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
        return i === 0 ? '<th scope="row">' + cell + "</th>" : "<td>" + cell + "</td>";
      }).join("");
      return "<tr" + (row.strong ? ' class="is-strong"' : "") + ">" + tr + "</tr>";
    }).join("");
  }

  function text(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || "—";
  }

  function html(id, value) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = value;
  }

  function init() {
    if (!P) {
      ["lead", "budget", "shows", "timetable", "checks", "venue", "next"].forEach(function (id) {
        var s = document.getElementById(id);
        if (s) s.hidden = true;
      });
      return;
    }

    text("planStatus", P.status);
    text("planCaution", P.caution);
    text("planSource", P.source);
    text("planUpdated", P.updated);
    text("planNextStep", P.nextStep);

    /* ── 予算 ── */
    text("planBudgetTotal", P.budgetTotal);
    html("planBudgetNote", strong(P.budgetNote || ""));
    fill("planBudget", P.budget, function (r) {
      return [esc(r.item), esc(r.amount) + " " + tag(r.tag), cutMark(r.cut), strong(r.note)];
    });

    /* ── 演出。**注意書きを本文と同じ重さで出す** ──
       「25万円でできる」とだけ書くと、見積が出たときに話が合わなくなる */
    var showsEl = document.getElementById("planShows");
    if (showsEl) {
      var shows = P.shows || [];
      if (!shows.length) {
        var sec = showsEl.closest ? showsEl.closest(".section") : null;
        if (sec) sec.hidden = true;
      } else {
        showsEl.innerHTML = shows.map(function (s) {
          return '<article class="show">' +
            '<p class="show__cost">' + esc(s.cost) + "</p>" +
            "<h3>" + esc(s.name) + "</h3>" +
            '<p class="show__size">' + esc(s.size) + "</p>" +
            "<p>" + strong(s.body) + "</p>" +
            '<p class="show__caution">' + strong(s.caution) + "</p>" +
            "</article>";
        }).join("");
      }
    }

    /* ── 当日 ── */
    text("planTimetableNote", P.timetableNote);
    fill("planTimetable", P.timetable, function (r) {
      return ['<b class="plan-time">' + esc(r.time) + "</b>", esc(r.guest), strong(r.staff)];
    });

    /* ── 会場 ── */
    text("planParkingTotal", P.parkingTotal);
    html("planParkingNote", strong(P.parkingNote || ""));
    fill("planParking", P.parking, function (r) {
      return [esc(r.name), esc(r.cars), esc(r.note)];
    });

    html("planFloorNote", strong(P.floorNote || ""));
    fill("planFloors", P.floors, function (r) {
      return [esc(r.f), strong(r.has)];
    });

    /* ── 確認すること ── */
    var checksEl = document.getElementById("planChecks");
    if (checksEl) {
      var checks = P.checks || [];
      if (!checks.length) {
        var c = checksEl.closest ? checksEl.closest(".section") : null;
        if (c) c.hidden = true;
      } else {
        checksEl.innerHTML = checks.map(function (k, i) {
          return '<article class="check">' +
            '<p class="check__no">' + String(i + 1).padStart(2, "0") + "</p>" +
            "<div>" +
              "<h3>" + esc(k.name) + " " + tag("未算出") + "</h3>" +
              "<p>" + strong(k.body) + "</p>" +
              '<p class="check__next"><b>次にやること</b> ' + strong(k.next) + "</p>" +
            "</div></article>";
        }).join("");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
