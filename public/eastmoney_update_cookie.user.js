// ==UserScript==
// @name         东方财富 Cookie 自动更新
// @name:zh-CN   东方财富 Cookie 自动更新
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  访问东方财富行情页时，自动将当前 cookie 发送到远程接口进行更新
// @description:zh-CN 访问 quote.eastmoney.com 时，自动将浏览器 cookie POST 到指定 API 更新
// @match        *://quote.eastmoney.com/*
// @grant        GM_xmlhttpRequest
// @connect      investapi.cufo.cc
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

    GM_xmlhttpRequest({
      method: "POST",
      url: API_URL,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ cookie }),
      timeout: 15000,
      onload: (response) => {
        if (response.status < 200 || response.status >= 300) {
          console.error(
            `[EastmoneyCookieUpdate] 更新失败: HTTP ${response.status}`,
            response.responseText
          );
          return;
        }

        try {
          const data = JSON.parse(response.responseText || "{}");
          console.log("[EastmoneyCookieUpdate] 更新成功:", data);
        } catch {
          console.log("[EastmoneyCookieUpdate] 更新成功:", response.responseText);
        }
      },
      onerror: (error) => {
        console.error("[EastmoneyCookieUpdate] 更新失败:", error);
      },
      ontimeout: () => {
        console.error("[EastmoneyCookieUpdate] 更新失败: 请求超时");
      },
    });
  }

  // 页面加载后延迟执行，确保 cookie 已写入
  window.addEventListener("load", () => {
    setTimeout(updateCookie, 3000);
  });
})();
