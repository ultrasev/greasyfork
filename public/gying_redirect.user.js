// ==UserScript==
// @name         gying.net 跳转
// @name:zh-CN   gying.net 跳转
// @namespace    https://example.com/
// @version      1.1
// @description  从 gying.net 自动跳转到主站
// @description:zh-CN 打开 gying.net 时，自动跳转到主站
// @license      MIT
// @updateURL    https://greasyfork.tpz.works.dev/gying_redirect.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/gying_redirect.user.js
// @match        https://gying.net/*
// @match        https://www.gying.net/*
// @match        https://gying.com/*
// @match        https://www.gying.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  location.replace("https://www.xn--wcv59z.com/");
})();
