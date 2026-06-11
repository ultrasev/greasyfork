// ==UserScript==
// @name         屏蔽虎扑
// @name:zh-CN   屏蔽虎扑
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  禁止访问虎扑，打开 hupu.com 时自动关闭标签页
// @description:zh-CN 禁止访问虎扑，打开 hupu.com 时自动关闭标签页并显示警告
// @license      MIT
// @updateURL    https://greasyfork.tpz.works.dev/block_hupu.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/block_hupu.user.js
// @match        *://*.hupu.com/*
// @match        *://hupu.com/*
// @run-at       document-start
// @grant        window.close
// ==/UserScript==

(function () {
  "use strict";
  window.stop();
  document.addEventListener("DOMContentLoaded", function () {
    document.head.innerHTML = "";
    document.body.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#1a1a2e;color:#e94560;font-family:sans-serif;font-size:3rem;">🚫 虎扑已屏蔽</div>';
    document.title = "🚫 Blocked";
    setTimeout(function () {
      window.close();
    }, 1500);
  });
})();
