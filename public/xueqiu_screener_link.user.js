// ==UserScript==
// @name         雪球导航添加"选股"入口（跳转选股工具）
// @namespace    https://example.com/
// @version      0.3
// @description  在雪球左侧导航「行情」上方插入「选股」链接，跳转到雪球选股工具。
// @description:zh-CN 在雪球左侧导航「行情」上方插入「选股」链接，跳转到雪球选股工具。
// @license      MIT
// @updateURL    https://greasyfork.tpz.workers.dev/xueqiu_screener_link.user.js
// @downloadURL  https://greasyfork.tpz.workers.dev/xueqiu_screener_link.user.js
// @match        https://xueqiu.com/
// @match        https://xueqiu.com/?*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const LINK_TEXT = '选股';
  // 图标字形（iconfont 私有区字符）：\ue619 首页 / \ue610 自选 / \ue61d 行情 / \ue614 基金
  const ICON_GLYPH = '\ue61d';
  const SCREENER_URL =
    'https://xueqiu.com/stock/screener?name=%E9%80%89%E8%82%A1%E5%B7%A5%E5%85%B7&url=https://xueqiu.com/stock/screener&first_name=5&second_name=0';
  const MARK = 'tm-screener-link';

  // 左侧导航结构（vue-web 渲染）：
  // <ul class="user__control__pannel">
  //   <li><a href="/#/?t=..."><i class="iconfont menu_icon">&#xe619;</i><span class="menu_name">首页</span></a></li>
  //   <li><a href="/#/optional?t=..."><i .../>&#xe610;</i><span class="menu_name">自选</span></a></li>
  //   <li><a id="hqTab" href="/hq" target="_blank"><i ...>&#xe61d;</i><span class="menu_name">行情</span></a></li>
  //   ...
  function insertLink() {
    if (document.getElementById(MARK)) return true;

    const hq = document.getElementById('hqTab');
    if (!hq) return false;

    const li = hq.closest('li');
    if (!li || !li.parentNode) return false;

    const item = li.cloneNode(true);
    const a = item.querySelector('a');
    if (!a) return false;

    a.id = MARK;
    a.setAttribute('href', SCREENER_URL);
    a.setAttribute('target', '_blank');
    a.setAttribute('data-analytics-data', `{tab:'${LINK_TEXT}'}`);

    const icon = item.querySelector('.menu_icon');
    if (icon) icon.textContent = ICON_GLYPH;

    const name = item.querySelector('.menu_name');
    if (name) {
      name.textContent = LINK_TEXT;
      name.style.color = '#722ed1'; // 紫色，与其他菜单项区分
    }

    li.parentNode.insertBefore(item, li); // 插在「行情」上方
    return true;
  }

  const waitFor = (t = 20000) => new Promise((res) => {
    if (insertLink()) return res();
    const obs = new MutationObserver(() => {
      if (insertLink()) { obs.disconnect(); res(); }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => { obs.disconnect(); res(null); }, t);
  });

  (async () => {
    await waitFor();
    // Vue 重渲染导航可能移除注入节点，持续兜底
    const mo = new MutationObserver(() => insertLink());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  })();
})();
