// ==UserScript==
// @name         拦截 AdBlock 推广页
// @name:zh-CN   拦截 AdBlock 推广页
// @namespace    https://example.com/
// @version      1.0
// @description  打开 getadblock.com 等广告拦截器推广页时自动关闭
// @description:zh-CN 打开 getadblock.com 等广告拦截器推广页时自动关闭标签页
// @license      MIT
// @updateURL    https://greasyfork.tpz.works.dev/block_adblock_pages.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/block_adblock_pages.user.js
// @match        *://getadblock.com/*
// @match        *://www.getadblock.com/*
// @match        *://adblockplus.org/*
// @match        *://www.adblockplus.org/*
// @match        *://getadblockpremium.com/*
// @match        *://www.getadblockpremium.com/*
// @run-at       document-start
// @grant        window.close
// ==/UserScript==

(function () {
  "use strict";
  window.close();
  window.stop();
  document.body.innerHTML = "";
  document.title = "";
})();
