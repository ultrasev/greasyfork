// ==UserScript==
// @name         财联社行情页 -> 东方财富跳转
// @name:zh-CN   财联社行情页 -> 东方财富跳转
// @namespace    https://example.com/
// @version      1.0
// @description  从财联社股票行情页自动跳转到东方财富对应行情页
// @description:zh-CN 打开财联社行情页时，自动跳转到东方财富对应的行情页面
// @license      MIT
// @updateURL    https://greasyfork.tpz.works.dev/cls_to_eastmoney.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/cls_to_eastmoney.user.js
// @match        https://www.cls.cn/stock?code=*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const code = new URLSearchParams(location.search).get("code");
  if (!code) return;

  const emUrl = `https://quote.eastmoney.com/concept/${code}.html`;
  location.replace(emUrl);
})();
