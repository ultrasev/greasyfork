// ==UserScript==
// @name         EPS详情 + 观察(自动检查)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  东方财富概念版个股页：插入eps详情+观察；打开页面先check是否已观察
// @match        https://quote.eastmoney.com/concept/*
// @grant        GM_xmlhttpRequest
// @connect      trades.cufo.cc
// ==/UserScript==

(function () {
  'use strict';

  const m = location.pathname.match(/\/concept\/([a-z]{2})(\d{6})/i);
  if (!m) return;
  const code = m[2];

  const TOKEN = 'passport123';
  const EPS_URL = `https://trades.cufo.cc/en/eps/${code}`;
  const API_CHECK = `https://trades.cufo.cc/api/stock-pick/check?code=${encodeURIComponent(code)}`;
  const API_ADD = `https://trades.cufo.cc/api/stock-pick`;

  const waitFor = (sel, t = 12000) => new Promise(res => {
    const now = document.querySelector(sel);
    if (now) return res(now);
    const obs = new MutationObserver(() => {
      const el = document.querySelector(sel);
      if (el) { obs.disconnect(); res(el); }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => { obs.disconnect(); res(null); }, t);
  });

  const toast = (msg, ms = 1800) => {
    const d = document.createElement('div');
    d.textContent = msg;
    Object.assign(d.style, {
      position: 'fixed',
      zIndex: 999999,
      right: '16px',
      top: '16px',
      background: 'rgba(0,0,0,0.78)',
      color: '#fff',
      padding: '8px 10px',
      borderRadius: '6px',
      fontSize: '14px',
      lineHeight: '18px'
    });
    document.body.appendChild(d);
    setTimeout(() => d.remove(), ms);
  };

  const httpJson = ({ method, url, body }) => new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method,
      url,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: body ? JSON.stringify(body) : undefined,
      timeout: 12000,
      onload: (resp) => {
        const ok = resp.status >= 200 && resp.status < 300;
        if (!ok) return reject(new Error(`HTTP ${resp.status}`));
        try { resolve(JSON.parse(resp.responseText || '{}')); }
        catch { resolve(resp.responseText); }
      },
      onerror: () => reject(new Error('Network error')),
      ontimeout: () => reject(new Error('Timeout')),
    });
  });

  const setWatchBtnState = (btn, state) => {
    // state: 'checking' | 'watchable' | 'watched'
    if (state === 'checking') {
      btn.textContent = '检查中...';
      btn.style.backgroundColor = '#bfbfbf';
      btn.style.opacity = '0.9';
      btn.style.pointerEvents = 'none';
      btn.dataset.state = 'checking';
    } else if (state === 'watched') {
      btn.textContent = '已观察';
      btn.style.backgroundColor = '#52c41a';
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'none';
      btn.dataset.state = 'watched';
    } else {
      btn.textContent = '观察';
      btn.style.backgroundColor = '#fa8c16';
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      btn.dataset.state = 'watchable';
    }
  };

  (async () => {
    const ops = await waitFor('.stockquote .sqt .sqt_r, .stockquote .sqt_r');
    if (!ops) return;

    const simBtn = Array.from(ops.querySelectorAll('a.sqt_r_link, .sqt_r_link, a, button, span'))
      .find(el => (el.textContent || '').trim() === '模拟交易');
    if (!simBtn) return;

    if (ops.querySelector('a.__tm_eps_detail, a.__tm_watch')) return;

    // eps 详情
    const epsBtn = document.createElement('a');
    epsBtn.className = '__tm_eps_detail';
    epsBtn.textContent = 'eps 详情';
    epsBtn.href = EPS_URL;
    epsBtn.target = '_blank';
    epsBtn.rel = 'noopener noreferrer';
    Object.assign(epsBtn.style, {
      display: 'inline-block',
      marginRight: '10px',
      padding: '2px 8px',
      backgroundColor: '#1677ff',
      color: '#fff',
      borderRadius: '4px',
      fontSize: '16px',
      lineHeight: '20px',
      textDecoration: 'none',
      verticalAlign: 'middle',
      cursor: 'pointer'
    });

    // 观察
    const watchBtn = document.createElement('a');
    watchBtn.className = '__tm_watch';
    watchBtn.href = 'javascript:void(0)';
    Object.assign(watchBtn.style, {
      display: 'inline-block',
      marginRight: '64px',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '16px',
      lineHeight: '20px',
      textDecoration: 'none',
      verticalAlign: 'middle',
      cursor: 'pointer',
      color: '#fff'
    });

    // 插入顺序：eps 详情、观察、模拟交易
    simBtn.parentNode.insertBefore(watchBtn, simBtn);
    simBtn.parentNode.insertBefore(epsBtn, watchBtn);

    // 初始化：先检查
    setWatchBtnState(watchBtn, 'checking');
    try {
      const r = await httpJson({ method: 'GET', url: API_CHECK });
      if (r && r.exists) setWatchBtnState(watchBtn, 'watched');
      else setWatchBtnState(watchBtn, 'watchable');
    } catch (e) {
      // check 失败时，给一个可点击状态（你也可以选择直接禁用）
      toast(`检查失败：${e.message || e}`);
      setWatchBtnState(watchBtn, 'watchable');
    }

    // 点击：仅在可观察时触发
    watchBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      if (watchBtn.dataset.state !== 'watchable') return;

      watchBtn.textContent = '提交中...';
      watchBtn.style.opacity = '0.85';
      watchBtn.style.pointerEvents = 'none';

      try {
        await httpJson({ method: 'POST', url: API_ADD, body: { code } });
        toast('已加入观察');
        setWatchBtnState(watchBtn, 'watched');
      } catch (e) {
        toast(`失败：${e.message || e}`);
        setWatchBtnState(watchBtn, 'watchable');
      }
    });
  })();
})();
