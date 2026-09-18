(() => {
  'use strict';
  if (document.getElementById('ai-cursor')) return;
  const c = document.createElement('div');
  c.id = 'ai-cursor';
  c.style.cssText = 'position:fixed;width:24px;height:24px;border:2px solid rgba(66,133,244,0.8);border-radius:50%;background:rgba(66,133,244,0.15);z-index:99999;pointer-events:none;transform:translate(-50%,-50%);transition:all 0.15s ease;box-shadow:0 0 8px rgba(66,133,244,0.3)';
  document.body.appendChild(c);
  const dot = document.createElement('div');
  dot.style.cssText = 'position:absolute;top:50%;left:50%;width:4px;height:4px;background:#4285f4;border-radius:50%;transform:translate(-50%,-50%)';
  c.appendChild(dot);
  document.addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px' });
})();
