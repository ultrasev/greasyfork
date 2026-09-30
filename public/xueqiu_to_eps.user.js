// ==UserScript==
// @name         Xueqiu EPS 详情按钮（极简版）
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在雪球个股页”可卖空”标签右侧插入紫色”EPS 详情”按钮，适配 2026 新版页面，纯文本定位防改版
// @match        https://*.xueqiu.com/S/*
// @match        https://*.xueqiu.com/s/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const BTN_ID = 'xq-eps-btn';
  const TAG = '[EPS按钮]';

  const getCode = () => {
    const m = location.pathname.match(/\/S\/[A-Z]+(\d{6})/i);
    return m ? m[1] : null;
  };

  // 归一化文本：去空白与零宽字符，防止模板里藏隐形字符导致精确匹配失败
  const norm = s => (s || '').replace(/[\s\u200b-\u200d\ufeff]/g, '');

  function createEpsButton(code) {
    const a = document.createElement('a');
    a.id = BTN_ID;
    a.dataset.code = code;
    a.textContent = 'EPS 详情';
    a.href = `https://trade.cufo.cc/en/eps/${code}`;
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

  // 深度优先遍历，返回满足 pred 的最深层（最后命中）元素
  function findDeepest(pred) {
    if (!document.body) return null;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let el, hit = null;
    while ((el = walker.nextNode())) {
      const t = norm(el.textContent);
      if (t && pred(t)) hit = el;
    }
    return hit;
  }

  function insert(code) {
    const btn = createEpsButton(code);

    // 策略1：文本恰为"可卖空"的最深层元素（个股页标签行）
    const exact = findDeepest(t => t === '可卖空');
    // 策略2：短文本中含"可卖空"（标签带图标字形时）
    const loose = exact || findDeepest(t => t.includes('可卖空') && t.length < 20);
    if (loose && loose.parentNode) {
      const wrap = document.createElement('span');
      wrap.style.display = 'inline-block';
      wrap.style.marginLeft = '6px';
      wrap.appendChild(btn);
      loose.parentNode.insertBefore(wrap, loose.nextSibling);
      console.log(TAG, '已插入到"可卖空"右侧');
      return true;
    }

    // 策略3：标题 h1
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.appendChild(btn);
      console.log(TAG, '已插入到 h1 右侧');
      return true;
    }

    // 策略4：含 "(SH:600887)" 形式代号的标题元素
    const title = findDeepest(t => t.length < 30 && /\((?:SH|SZ|BJ):?\d{6}\)/.test(t));
    if (title) {
      title.appendChild(btn);
      console.log(TAG, '已插入到标题右侧');
      return true;
    }
    return false;
  }

  let missingSince = Date.now();
  let warned = false;
  const obs = new MutationObserver(() => {
    const code = getCode();
    const existing = document.getElementById(BTN_ID);

    if (!code) { // 站内跳转离开了个股页
      if (existing) existing.remove();
      return;
    }
    if (existing && existing.dataset.code === code) return; // 已就位

    if (existing) existing.remove(); // 换了股票，重建
    // 前 8s 优先等"可卖空"出现；超时后接受标题兜底
    if (Date.now() - missingSince < 8000 && !findDeepest(t => t.includes('可卖空'))) return;
    if (insert(code)) {
      missingSince = Date.now();
      warned = false;
    } else if (!warned && Date.now() - missingSince > 20000) {
      console.warn(TAG, '20 秒内未找到插入锚点，请反馈页面结构');
      warned = true;
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
