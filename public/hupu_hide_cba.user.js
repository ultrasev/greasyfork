// ==UserScript==
// @name         虎扑净化：隐藏CBA + 关键词帖子屏蔽
// @name:zh-CN   虎扑净化：隐藏CBA + 关键词帖子屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  隐藏CBA赛程面板和导航，只显示NBA赛程，屏蔽含指定关键词的帖子
// @description:zh-CN 隐藏CBA赛程面板和导航，只显示NBA赛程，屏蔽含指定关键词的帖子
// @license      MIT
// @updateURL    https://greasyfork.tpz.works.dev/hupu_hide_cba.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/hupu_hide_cba.user.js
// @match        https://*.hupu.com/*
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  // 隐藏 CBA 赛程面板、CBA 导航标签、顶部导航 CBA 入口
  GM_addStyle(`
    .cba-schedule { display: none !important; }
    .navbar-item[data-schedule="cba-schedule"] { display: none !important; }
    a[data-first-navi="CBA"] { display: none !important; }
  `);

  // 显示 NBA 赛程面板，设为激活状态
  function showNbaSchedule() {
    const nbaPanel = document.querySelector('.nba-schedule');
    const nbaTab = document.querySelector('.navbar-item[data-schedule="nba-schedule"]');
    if (nbaPanel) nbaPanel.classList.remove('hide');
    if (nbaTab) {
      nbaTab.classList.add('navbar-item-active');
      nbaTab.classList.add('PSiteBasketballCardFlip_W_hover');
    }
  }

  showNbaSchedule();

  // 要屏蔽的关键词列表
  const keywords = ['瀚森', '姚明', '伦纳德', '中国', 'CBA', '华为', '问界', '雷军', '鸿蒙'];

  // 屏蔽帖子列表中的帖子
  function hideBbsPostList() {
    document.querySelectorAll('li.bbs-sl-web-post-body').forEach(postElem => {
      const titleElem = postElem.querySelector('.p-title');
      if (titleElem) {
        const title = titleElem.textContent;
        if (keywords.some(k => title.includes(k))) {
          postElem.style.display = 'none';
        }
      }
    });
  }

  // 屏蔽主页推荐列表中的帖子
  function hideHomepageListItems() {
    document.querySelectorAll('div.list-item').forEach(divElem => {
      const link = divElem.querySelector('a');
      if (link && keywords.some(k => link.textContent.includes(k))) {
        divElem.style.display = 'none';
      }
    });
  }

  // 屏蔽banner推荐中带有特定类名的帖子
  function hideBannerItemPosts() {
    document.querySelectorAll('a.banner-item').forEach(aElem => {
      const titleSpan = aElem.querySelector('.title-container .title');
      if (titleSpan && keywords.some(k => titleSpan.textContent.includes(k))) {
        aElem.style.display = 'none';
      }
    });
  }

  // 统一执行屏蔽操作
  function hideAll() {
    showNbaSchedule();
    hideBbsPostList();
    hideHomepageListItems();
    hideBannerItemPosts();
  }

  // 初始屏蔽
  hideAll();

  // 利用 MutationObserver 监听 DOM 变化，处理动态加载或异步加载内容
  const observer = new MutationObserver(hideAll);
  observer.observe(document.body, { childList: true, subtree: true });
})();
