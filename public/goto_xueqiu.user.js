// ==UserScript==
// @name         东方财富行情页/基金页 -> 雪球跳转按钮(蓝色, 含科创板/港股/基金/ETF联接)
// @name:zh-CN   东方财富行情页/基金页 -> 雪球跳转按钮(蓝色, 含科创板/港股/基金/ETF联接)
// @namespace    https://example.com/
// @version      1.6
// @description  Add a Xueqiu jump button to Eastmoney quote and fund pages, with support for STAR Market, HK stocks, funds, related ETFs, and custom fund mappings.
// @description:zh-CN 在东方财富行情页和基金页添加“雪球”跳转按钮，支持 A股、科创板、港股、基金、相关 ETF 优先跳转，以及自定义基金映射。
// @license      MIT
// @updateURL    https://greasyfork.tpz.works.dev/goto_xueqiu.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/goto_xueqiu.user.js
// @match        https://quote.eastmoney.com/sz*.html
// @match        https://quote.eastmoney.com/sz*.html?*
// @match        https://quote.eastmoney.com/sh*.html
// @match        https://quote.eastmoney.com/sh*.html?*
// @match        https://quote.eastmoney.com/kcb/*.html
// @match        https://quote.eastmoney.com/kcb/*.html?*
// @match        https://quote.eastmoney.com/hk/*.html
// @match        https://quote.eastmoney.com/hk/*.html?*
// @match        https://fund.eastmoney.com/*.html
// @match        https://fund.eastmoney.com/*.html?*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const BTN_ID = "tm-xueqiu-btn";

  // 基金页自定义映射：基金代码 -> 雪球symbol
  const CUSTOM_FUND_SYMBOL_MAP = {
    "012414": "SZ161725",
    "021760": "SZ159992",
    "010365": "SH501025",
  };

  function hostType() {
    return location.hostname.toLowerCase() === "fund.eastmoney.com"
      ? "fund"
      : "quote";
  }

  function pageType() {
    const p = location.pathname.toLowerCase();
    if (p.startsWith("/kcb/")) return "kcb";
    if (p.startsWith("/hk/")) return "hk";
    return "normal";
  }

  function getFundCodeFromUrl() {
    const m = location.pathname.match(/^\/(\d{6})\.html$/);
    return m ? m[1] : null;
  }

  function getCustomFundSymbol(code) {
    return code ? CUSTOM_FUND_SYMBOL_MAP[code] || null : null;
  }

  function guessFundMarketFromHoldingsLinks() {
    const a = document.querySelector(
      'a[href*="quote.eastmoney.com/unify/r0."]',
    );
    if (a) return "SZ";
    const b = document.querySelector(
      'a[href*="quote.eastmoney.com/unify/r1."]',
    );
    if (b) return "SH";
    return null;
  }

  function findRelatedEtfCodeFromTitle() {
    const tit = document.querySelector(".fundDetail-header .fundDetail-tit");
    if (!tit) return null;

    const links = tit.querySelectorAll("a[href]");
    for (const a of links) {
      const text = (a.textContent || "").replace(/\s+/g, "");
      if (!text.includes("查看相关ETF")) continue;
      if (text.includes("查看相关ETF联接")) continue;

      const href = a.href || a.getAttribute("href") || "";
      const m = href.match(/fund\.eastmoney\.com\/(\d{6})\.html/i);
      if (m) return m[1];
    }

    return null;
  }

  function guessEtfSymbolFromFundCode(code) {
    if (/^(50|51|56|58)\d{4}$/.test(code)) return "SH" + code;
    if (/^(15|16)\d{4}$/.test(code)) return "SZ" + code;
    return "SZ" + code;
  }

  function parseSymbolFromUrl() {
    const host = hostType();
    const p = location.pathname;

    let m = p.match(/^\/(sz|sh)(\d+)\.html$/i);
    if (m) return `${m[1].toUpperCase()}${m[2]}`;

    m = p.match(/^\/kcb\/(\d+)\.html$/i);
    if (m) return `SH${m[1]}`;

    m = p.match(/^\/hk\/(\d+)\.html$/i);
    if (m) return m[1];

    if (host === "fund") {
      const selfCode = getFundCodeFromUrl();

      // 优先级1：自定义映射
      const customSymbol = getCustomFundSymbol(selfCode);
      if (customSymbol) return customSymbol;

      // 优先级2：标题区“查看相关ETF”
      const relatedEtfCode = findRelatedEtfCodeFromTitle();
      if (relatedEtfCode) {
        return guessEtfSymbolFromFundCode(relatedEtfCode);
      }

      // 优先级3：原有自动判断
      if (selfCode) {
        const mk = guessFundMarketFromHoldingsLinks();
        if (mk) return `${mk}${selfCode}`;

        if (/^(50|51|56|58)\d{4}$/.test(selfCode)) return `SH${selfCode}`;
        if (/^(15|16)\d{4}$/.test(selfCode)) return `SZ${selfCode}`;

        return `SH${selfCode}`;
      }
    }

    return null;
  }

  function buildBtn(symbol) {
    const a = document.createElement("a");
    a.id = BTN_ID;
    a.textContent = "雪球";
    a.href = `https://xueqiu.com/S/${symbol}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = `打开雪球：${symbol}`;

    a.style.display = "inline-block";
    a.style.marginLeft = "10px";
    a.style.marginRight = "10px";
    a.style.padding = "2px 10px";
    a.style.border = "1px solid #1677ff";
    a.style.borderRadius = "4px";
    a.style.background = "#1677ff";
    a.style.color = "#fff";
    a.style.textDecoration = "none";
    a.style.lineHeight = "22px";
    a.style.fontSize = "15px";
    a.style.cursor = "pointer";
    a.style.verticalAlign = "middle";

    a.addEventListener("mouseenter", () => {
      a.style.background = "#4096ff";
    });
    a.addEventListener("mouseleave", () => {
      a.style.background = "#1677ff";
    });

    return a;
  }

  function insertNormal(btn) {
    const qtrlink = document.querySelector(
      ".quote_title .quote_title_r .qtrlink",
    );
    if (!qtrlink) return false;
    btn.style.marginLeft = "0px";
    qtrlink.insertBefore(btn, qtrlink.firstChild);
    return true;
  }

  function insertKcb(btn) {
    const items = document.querySelectorAll(".cybzb .zbitems li span");
    if (!items.length) return false;

    let targetSpan = null;
    for (const sp of items) {
      if ((sp.textContent || "").includes("是否盈利")) {
        targetSpan = sp;
        break;
      }
    }
    if (!targetSpan) return false;

    targetSpan.insertAdjacentElement("afterend", btn);
    return true;
  }

  function insertHk(btn) {
    const qtrlink = document.querySelector(
      ".quote_title .quote_title_r .qtrlink",
    );
    if (!qtrlink) return false;
    btn.style.marginLeft = "0px";
    qtrlink.insertBefore(btn, qtrlink.firstChild);
    return true;
  }

  function insertFund(btn) {
    const tit = document.querySelector(".fundDetail-header .fundDetail-tit");
    if (tit) {
      btn.style.marginLeft = "8px";
      tit.appendChild(btn);
      return true;
    }

    const fixed = document.querySelector("#fixedTop .fixedBuy");
    if (fixed) {
      btn.style.marginLeft = "8px";
      fixed.appendChild(btn);
      return true;
    }

    return false;
  }

  function insertFallbackFixed(btn) {
    btn.style.position = "fixed";
    btn.style.top = "70px";
    btn.style.right = "20px";
    btn.style.zIndex = "99999";
    document.body.appendChild(btn);
    return true;
  }

  function ensureButton() {
    const symbol = parseSymbolFromUrl();
    if (!symbol) return;
    if (document.getElementById(BTN_ID)) return;

    const btn = buildBtn(symbol);
    const host = hostType();
    const t = pageType();

    let ok = false;
    if (host === "fund") {
      ok = insertFund(btn);
    } else {
      ok =
        t === "kcb"
          ? insertKcb(btn)
          : t === "hk"
            ? insertHk(btn)
            : insertNormal(btn);
    }

    if (!ok) insertFallbackFixed(btn);
  }

  ensureButton();

  const mo = new MutationObserver(() => ensureButton());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
