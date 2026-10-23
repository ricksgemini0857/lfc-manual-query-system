(() => {
  function init() {
    const buttons = [...document.querySelectorAll('.motion-toggle')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reduced.matches;
    function render() {
      document.body.classList.toggle('story-paused', paused || reduced.matches);
      for (const button of buttons) {
        const label = reduced.matches ? '已減少動態' : paused ? '播放動畫' : '暫停動畫';
        button.disabled = reduced.matches;
        button.setAttribute('aria-pressed', String(paused || reduced.matches));
        button.setAttribute('aria-label', reduced.matches ? '已依裝置設定減少插圖動態' : paused ? '播放插圖動畫' : '暫停插圖動畫');
        button.querySelector('span').textContent = label;
      }
    }
    buttons.forEach(button => button.addEventListener('click', () => { paused = !paused; render(); }));
    reduced.addEventListener('change', () => { paused = reduced.matches; render(); });
    render();
  }
  if (document.readyState === 'loading' || document.readyState === 'interactive') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
