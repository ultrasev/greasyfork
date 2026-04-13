// ==UserScript==
// @name         东方财富 Cookie 自动更新
// @name:zh-CN   东方财富 Cookie 自动更新
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  访问东方财富行情页时，自动将当前 cookie 发送到远程接口进行更新
// @description:zh-CN 访问 quote.eastmoney.com 时，自动将浏览器 cookie POST 到指定 API 更新
// @match        *://quote.eastmoney.com/*
// @grant        none
// @updateURL    https://greasyfork.tpz.works.dev/eastmoney_update_cookie.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/eastmoney_update_cookie.user.js
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  const API_URL = "https://investapi.cufo.cc/api/cookie/eastmoney/update";

  function updateCookie() {
    const cookie = document.cookie;
    if (!cookie) {
      console.warn("[EastmoneyCookieUpdate] 当前页面无 cookie，跳过");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cookie }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("[EastmoneyCookieUpdate] 更新成功:", data);
      })
      .catch((err) => {
        console.error("[EastmoneyCookieUpdate] 更新失败:", err);
      });
  }

  // 页面加载后延迟执行，确保 cookie 已写入
  window.addEventListener("load", () => {
    setTimeout(updateCookie, 3000);
  });
})();
