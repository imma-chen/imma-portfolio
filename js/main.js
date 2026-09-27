// js/main.js
// 整个网站的入口：把各个功能模块引进来，页面加载后依次初始化。

import { initLoader } from './modules/loader.js';
import { initParallax } from './modules/parallax.js';
import { initHotspots } from './modules/hotspots.js';
import { initPanels } from './modules/panels.js';
import { initRecordPlayer } from './modules/audio.js';

initLoader();
initPanels();
initHotspots();
initRecordPlayer();
initParallax(
  document.getElementById('scene-stage'),
  document.getElementById('scene-layer')
);
