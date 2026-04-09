// ==UserScript==
// @name         Xueqiu EPS 详情按钮（极简版）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在雪球个股页”可卖空”右侧插入紫色”EPS 详情”按钮（基金页显示在标题旁）
// @match        https://xueqiu.com/S/*
// @match        https://xueqiu.com/s/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 从 URL 提取 6 位代码（/S/SZ000423 或 /S/SH600887）
    const m = location.pathname.match(/\/S\/[A-Z]+(\d{6})/i);
    if (!m) return;
    const code = m[1];

    // 等待元素出现
    const waitFor = (sel, t = 10000) => new Promise(r => {
      const now = document.querySelector(sel);
      if (now) return r(now);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(sel);
        if (el) { obs.disconnect(); r(el); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); r(null); }, t);
    });

    function createEpsButton() {
      const a = document.createElement('a');
      a.textContent = 'EPS 详情';
      a.href = `https://trades.cufo.cc/en/eps/${code}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      Object.assign(a.style, {
        display: 'inline-block',
        marginLeft: '8px',
        padding: '2px 8px',
        backgroundColor: 'purple',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '12px',
        lineHeight: '20px',
        textDecoration: 'none',
        verticalAlign: 'middle',
        cursor: 'pointer'
      });
      return a;
    }

    (async () => {
      // 策略1：个股页 — 插入"可卖空"右侧
      const issues = await waitFor('.stock__main .stock-issues, .stock-issues', 12000);
      if (issues) {
        const shortable = Array.from(issues.querySelectorAll('div, span'))
          .find(el => (el.textContent || '').trim() === '可卖空');
        if (shortable) {
          const wrap = document.createElement('span');
          wrap.style.display = 'inline-block';
          wrap.style.marginLeft = '6px';
          wrap.appendChild(createEpsButton());
          if (shortable.nextSibling) {
            shortable.parentNode.insertBefore(wrap, shortable.nextSibling);
          } else {
            shortable.parentNode.appendChild(wrap);
          }
          return;
        }
      }

      // 策略2：基金/ETF 页 — 插入标题 h1.stock-name 右侧
      const title = await waitFor('h1.stock-name', 5000);
      if (title) {
        title.appendChild(createEpsButton());
      }
    })();
  })();
