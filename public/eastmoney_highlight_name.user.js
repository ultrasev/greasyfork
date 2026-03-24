// ==UserScript==
// @name         Eastmoney 自选股：仅名称变黄
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在东方财富网站高亮显示自选股名称
// @match        *://*.eastmoney.com/*
// @grant        none
// @updateURL    https://greasyfork.tpz.works.dev/eastmoney_highlight_name.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/eastmoney_highlight_name.user.js
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const TARGET = ["中国电信","伯特利","蔚蓝锂芯","杭州银行","重庆银行","成都银行","海康威视","羚锐制药","成都燃气","梅花生物","浦发银行","南京银行"]; // 需要高亮的名称
  const COLOR = "#ffb300";     // 黄色系（可改成 #ff0 更亮）

  function markNameEl(el) {
    // 只改"当前元素"，不影响整行
    el.style.color = COLOR;
    el.style.fontWeight = "700";
  }

  function scan(root) {
    // 只处理短文本节点，避免扫描整页长文本
    const els = root.querySelectorAll("a, span, div, td");
    for (const el of els) {
      const t = (el.textContent || "").trim();
      if (!t || t.length > 12) continue;

      // 精确匹配"名称就是这几个字"
      if (TARGET.includes(t)) markNameEl(el);

      // 如果页面里可能是"成都银行 601838"，用这句替代上面的精确匹配：
      // if (t.includes("成都银行")) markNameEl(el);
    }
  }

  function start() {
    const container = document.querySelector("#wl_mainbody") || document.body;
    scan(container);

    const ob = new MutationObserver(() => scan(container));
    ob.observe(container, { childList: true, subtree: true }); // 监听动态渲染 [web:241]
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
