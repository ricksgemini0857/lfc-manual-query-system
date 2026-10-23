(() => {
  function init() {
    const main = document.getElementById('main-container');
    const form = document.getElementById('login-form');
    const title = document.getElementById('title-section');
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const search = document.getElementById('search-btn');
    const result = document.getElementById('result');
    const heading = document.getElementById('manual-reader-heading');
    const status = document.getElementById('manual-status');
    let busy = false;
    function syncTabs() {
      result.querySelectorAll('.tab-button').forEach(button => {
        const active = button.classList.contains('active');
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
    }
    function decorate() {
      const documents = Boolean(result.querySelector('.tab-content'));
      const wasDocuments = main.dataset.view === 'documents';
      main.dataset.view = documents ? 'documents' : 'lookup';
      heading.classList.toggle('hidden', !documents);
      busy = Boolean(result.querySelector('.loader'));
      search.disabled = busy;
      search.querySelector('.search-label').textContent = busy ? '查詢中…' : '查詢';
      status.textContent = busy ? '正在查詢說明書。' : documents ? '已開啟說明書與教學。' : result.textContent.trim();
      const buttons = [...result.querySelectorAll('.tab-button')];
      buttons.forEach((button, index) => {
        const panel = document.getElementById(button.dataset.target);
        button.id = `manual-tab-${button.dataset.target}`;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', button.dataset.target);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', button.id);
        const group = button.parentElement;
        group.classList.add('document-tabs');
        group.setAttribute('role', 'tablist');
        group.setAttribute('aria-label', '說明書與教學');
        if (!button.dataset.enhanced) {
          button.dataset.enhanced = 'true';
          button.addEventListener('click', syncTabs);
          button.addEventListener('keydown', event => {
            const next = event.key === 'ArrowRight' ? (index + 1) % buttons.length
              : event.key === 'ArrowLeft' ? (index - 1 + buttons.length) % buttons.length
              : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : -1;
            if (next < 0) return;
            event.preventDefault();
            buttons[next].click();
            buttons[next].focus();
          });
        }
        const iframe = panel.querySelector('iframe');
        if (iframe) iframe.title = button.textContent.trim();
      });
      syncTabs();
      result.querySelectorAll('a[target="_blank"]').forEach(link => { link.rel = 'noopener noreferrer'; });
      const back = document.getElementById('back-to-search-btn');
      if (back && !back.dataset.enhanced) {
        back.dataset.enhanced = 'true';
        back.addEventListener('click', () => name.focus());
      }
      const video = document.getElementById('video-placeholder');
      if (video && !video.dataset.enhanced) {
        video.dataset.enhanced = 'true';
        video.tabIndex = 0;
        video.setAttribute('role', 'button');
        video.setAttribute('aria-label', '在新分頁播放教學影片');
        video.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); video.click(); }
        });
      }
      if (documents && !wasDocuments) heading.querySelector('h1').focus();
    }
    new MutationObserver(decorate).observe(result, { childList: true, subtree: true });
    form.addEventListener('submit', event => { event.preventDefault(); if (!busy) search.click(); });
    [name, phone].forEach(input => input.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); if (!busy) search.click(); }
    }));
    // The public frame guide uses the same existing documents, without a customer lookup.
    if (new URLSearchParams(location.search).get('guide') === 'frame') {
      form.style.display = 'none';
      title.style.display = 'none';
      result.innerHTML = `<div class="warning-box"><div><p>公開教學文件預覽</p><p>專屬積木畫說明書，請返回並輸入姓名與手機號碼查詢。</p></div></div>
        <div><button class="tab-button active" data-target="tab2">邊框組裝說明書</button><button class="tab-button" data-target="tab3">教學影片</button></div>
        <div id="tab2" class="tab-content active"><iframe class="preview-iframe" title="邊框組裝說明書" src="https://drive.google.com/file/d/1Oe4gyfuH852CJW76j0SpsoaL0wOfd0qM/preview"></iframe><div class="mt-6"><a class="tech-button" target="_blank" href="https://drive.google.com/uc?export=download&id=1Oe4gyfuH852CJW76j0SpsoaL0wOfd0qM">下載邊框組裝說明書 ↗</a></div></div>
        <div id="tab3" class="tab-content"><div id="video-placeholder" class="preview-iframe"><div><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/></svg><p>點擊播放教學影片</p><p>將在新分頁中開啟</p></div></div></div><div class="mt-8"><button id="back-to-search-btn" class="secondary-button">返回查詢</button></div>`;
      result.querySelectorAll('.tab-button').forEach(button => button.addEventListener('click', () => {
        result.querySelectorAll('.tab-button').forEach(item => item.classList.toggle('active', item === button));
        result.querySelectorAll('.tab-content').forEach(panel => panel.classList.toggle('active', panel.id === button.dataset.target));
      }));
      document.getElementById('video-placeholder').addEventListener('click', () => {
        window.open('https://drive.google.com/file/d/1v4AbpqD2z0hKKrJt3ePJyO5EMgdHh4Dm/view?usp=sharing', '_blank', 'noopener');
      });
      document.getElementById('back-to-search-btn').addEventListener('click', () => {
        result.innerHTML = '';
        form.style.display = 'block';
        title.style.display = 'block';
        name.value = phone.value = '';
        const url = new URL(location.href);
        url.searchParams.delete('guide');
        history.replaceState(null, '', url);
      });
    }
    decorate();
  }
  if (document.readyState === 'loading' || document.readyState === 'interactive') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
