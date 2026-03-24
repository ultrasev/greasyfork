// ==UserScript==
// @name         基金链接
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  东方财富个股页主力动向左侧插入基金链接，参照"加自选"按钮样式
// @match        https://quote.eastmoney.com/*
// @exclude      https://quote.eastmoney.com/concept/*
// @grant        none
// @updateURL    https://greasyfork.tpz.works.dev/fund_link.user.js
// @downloadURL  https://greasyfork.tpz.works.dev/fund_link.user.js
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // 提取股票代码，支持sh600xxx、sz000xxx等格式
  function extractCode() {
    const m = location.pathname.match(/\/(sh|sz)(\d{6})\.html/i);
    if (m && m[2]) {
      return m[2];
    }
    return null;
  }

  const fundCode = extractCode();
  if (!fundCode) return; // 无法提取代码，则不执行

  const fundUrl = `https://fund.eastmoney.com/${fundCode}.html`;

  // 等待元素出现
  const waitFor = (selector, timeout = 12000) => new Promise(resolve => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });

  (async () => {
    const container = await waitFor('.quote_title_r .qtrlink');
    if (!container) return;

    if (container.querySelector('a.__tm_fund_link')) return;

    const fundLink = document.createElement('a');
    fundLink.className = '__tm_fund_link';
    fundLink.textContent = '基金链接';
    fundLink.href = fundUrl;
    fundLink.target = '_blank';
    fundLink.rel = 'noopener noreferrer';

    // 参照"加自选"按钮的橙色背景样式
    Object.assign(fundLink.style, {
      display: 'inline-block',
      marginRight: '32px',
      padding: '4px 8px',
      backgroundColor: '#ff6600',
      color: '#fff',               // 白色文字
      borderRadius: '16px',         // 圆角
      fontSize: '14px',

      textDecoration: 'none',
      cursor: 'pointer',
      border: 'none'
    });

    // 鼠标悬停效果
    fundLink.addEventListener('mouseenter', () => {
      fundLink.style.backgroundColor = '#ff5500';
    });
    fundLink.addEventListener('mouseleave', () => {
      fundLink.style.backgroundColor = '#ff6600';
    });

    container.insertBefore(fundLink, container.firstChild);
  })();
})();
