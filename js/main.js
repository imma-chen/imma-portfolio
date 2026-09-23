// js/main.js
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// 1. 获取 HTML 里的加载元素
const loaderElement = document.getElementById('loader');
const counterElement = document.getElementById('loader-counter');
const progressBarFill = document.getElementById('progress-bar-fill');

let targetProgress = 0;  // 实际模型下载的进度
let currentProgress = 0; // 画面上显示的平滑进度

// 2. 创建 Three.js 加载管理器（监工）
const manager = new THREE.LoadingManager();

// 当 3D 资源正在下载时触发
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
  // 计算出真实的百分比 (0 到 100)
  targetProgress = Math.round((itemsLoaded / itemsTotal) * 100);
};

// 当所有 3D 资源下载完毕时触发
manager.onLoad = function () {
  targetProgress = 100;
};

// 3. 数字平滑动画函数（让数字 01, 02... 丝滑递增，而不是蹦跳）
function updateLoader() {
  if (currentProgress < targetProgress) {
    currentProgress += 1; // 每次递增 1
    
    // 把数字格式化为两位数 (比如把 5 变成 '05')
    const formattedNumber = currentProgress < 10 ? `0${currentProgress}` : currentProgress;
    counterElement.textContent = formattedNumber;
    
    // 更新进度条的宽度
    progressBarFill.style.width = `${currentProgress}%`;
  }

  // 当显示数字真正到达 100% 时，触发离场幕布效果
  if (currentProgress >= 100) {
    setTimeout(() => {
      // 加上 .loaded 类，触发 CSS 里的 scale 放大 + opacity 透明离场动画
      loaderElement.classList.add('loaded');
      
      // 恢复网页滚动能力
      document.body.style.overflow = 'auto';
    }, 300); // 稍微停顿 0.3 秒增强仪式感
  } else {
    // 还没到 100%，下一帧继续更新
    requestAnimationFrame(updateLoader);
  }
}

// 启动平滑数字循环
updateLoader();

// 4. 导入你的 3D 模型测试 (如果没有模型，可先用模拟器测试)
const loader = new GLTFLoader(manager);
// loader.load('assets/models/desk_scene.glb', (gltf) => { ... });

// 💡 模拟测试：假设没有真实模型时，用代码模拟 3 秒下载过程
let simulatedLoad = 0;
const fakeTimer = setInterval(() => {
  simulatedLoad += 10;
  targetProgress = simulatedLoad;
  if (simulatedLoad >= 100) clearInterval(fakeTimer);
}, 200);
