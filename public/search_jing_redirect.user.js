// ==UserScript==
// @name         搜索「经。」跳转 X
// @name:zh-CN   搜索「经。」跳转 X
// @namespace    https://example.com/
// @version      0.1
// @description  五笔输入法把 "x." 误上屏为「经。」时，自动跳转 x.com
// @description:zh-CN 五笔输入法把 "x." 误上屏为「经。」时，自动跳转 x.com
// @license      MIT
// @updateURL    https://greasyfork.tpz.works.dev/search_jing_redirect.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/search_jing_redirect.user.js
// @match        *://*/search*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // 五笔里 x 是高频字「经」，中文态句号是「。」，回车后即搜索「经。」
  if (location.pathname !== '/search') return;
  const q = new URLSearchParams(location.search).get('q');
  if (q === '经。') {
    location.replace('https://x.com/');
  }
})();
