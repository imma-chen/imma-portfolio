// js/modules/panels.js
// 控制 About / Projects / Drawings 这几个内容面板的打开与关闭。

export function openPanel(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('open');
}

export function closePanel(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.remove('open');
}

export function closeAllPanels() {
  document.querySelectorAll('.scene-panel.open').forEach((panel) => {
    panel.classList.remove('open');
  });
}

export function initPanels() {
  // 每个面板自带的关闭按钮
  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = button.closest('.scene-panel');
      if (panel) panel.classList.remove('open');
    });
  });

  // 点击面板外层的半透明背景也可以关闭
  document.querySelectorAll('.scene-panel').forEach((panel) => {
    panel.addEventListener('click', (event) => {
      if (event.target === panel) panel.classList.remove('open');
    });
  });

  // 按 Esc 关闭当前打开的面板
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllPanels();
  });
}
