// js/modules/hotspots.js
// 场景里每个可点击的物件（电脑、照片墙、本子...）点击后打开对应面板。
// 唱片机是特例，交给 audio.js 处理，这里跳过它。

import { openPanel } from './panels.js';

export function initHotspots() {
  document.querySelectorAll('.hotspot[data-panel]').forEach((hotspot) => {
    hotspot.addEventListener('click', () => {
      const panelId = hotspot.getAttribute('data-panel');
      if (panelId) openPanel(panelId);
    });
  });
}
