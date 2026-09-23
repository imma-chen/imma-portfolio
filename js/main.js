// js/main.js

// ==================== 1. 初始化 LUCIDE 图标 ====================
if (window.lucide) {
  window.lucide.createIcons();
}

// ==================== 2. MONOLITH 加载动画逻辑 ====================
const loaderElement = document.getElementById('loader');
const counterElement = document.getElementById('loader-counter');
const progressBarFill = document.getElementById('progress-bar-fill');

let targetProgress = 0;   // 目标进度
let currentProgress = 0;  // 实际平滑显示的进度

// 页面加载开始时锁定滚动
document.body.style.overflow = 'hidden';

// 平滑数字递增与幕布淡出循环
function updateLoader() {
  if (currentProgress < targetProgress) {
    currentProgress += 1;
    
    // 保持 00, 01, ..., 99 两位数格式
    const formattedNumber = currentProgress < 10 ? `0${currentProgress}` : currentProgress;
    if (counterElement) counterElement.textContent = formattedNumber;
    if (progressBarFill) progressBarFill.style.width = `${currentProgress}%`;
  }

  // 到达 100% 后平滑淡出并解封页面滚动
  if (currentProgress >= 100) {
    setTimeout(() => {
      if (loaderElement) {
        loaderElement.classList.add('loaded');
      }
      document.body.style.overflow = 'auto'; // 恢复页面滚动
    }, 300);
  } else {
    requestAnimationFrame(updateLoader);
  }
}

// 启动动画渲染帧
updateLoader();

// 模拟页面资源/3D场景装载过程 (50毫秒递增5%)
let simulatedProgress = 0;
const fakeLoaderTimer = setInterval(() => {
  simulatedProgress += 5;
  targetProgress = simulatedProgress;
  
  if (simulatedProgress >= 100) {
    clearInterval(fakeLoaderTimer);
  }
}, 50);


// ==================== 3. 页面滚动与昼夜交替控制 ====================
const skyBg = document.getElementById('sky-background');
const sunMoon = document.getElementById('sun-moon');
const sunGlow = document.getElementById('sun-glow');
const timeDisplay = document.getElementById('time-display');
const lampLight = document.getElementById('lamp-light');
const bodyContainer = document.getElementById('body-container');

// RGB 颜色插值算法（实现天空色彩丝滑过渡）
function interpolateColor(color1, color2, factor) {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

// 天空不同时段的三色渐变定义 [Top, Mid, Bottom]
const skyPhases = [
  { top: [255, 179, 133], mid: [255, 209, 169], bottom: [255, 240, 229] }, // 01. Dawn (晨曦)
  { top: [120, 180, 240], mid: [180, 220, 255], bottom: [230, 245, 255] }, // 02. Midday (正午)
  { top: [180, 70, 100],  mid: [240, 130, 90],  bottom: [255, 200, 120] }, // 03. Sunset (黄昏)
  { top: [12, 15, 28],    mid: [22, 28, 48],    bottom: [38, 42, 68] }     // 04. Night (黑夜)
];

// 监听滚动事件
window.addEventListener('scroll', () => {
  if (!skyBg) return;

  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY;
  const progress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);

  // 计算当前处于哪两个天空时段之间
  const totalPhases = skyPhases.length - 1;
  const rawPhase = progress * totalPhases;
  const phaseIndex = Math.floor(rawPhase);
  const factor = rawPhase - phaseIndex;

  const p1 = skyPhases[phaseIndex];
  const p2 = skyPhases[Math.min(phaseIndex + 1, totalPhases)];

  // 动态插值计算 RGB
  const topColor = interpolateColor(p1.top, p2.top, factor);
  const midColor = interpolateColor(p1.mid, p2.mid, factor);
  const bottomColor = interpolateColor(p1.bottom, p2.bottom, factor);

  // 更新天空背景渐变
  skyBg.style.background = `linear-gradient(180deg, ${topColor} 0%, ${midColor} 50%, ${bottomColor} 100%)`;

  // 太阳/月亮下沉动画
  if (sunMoon) {
    const translateY = progress * 320;
    sunMoon.style.transform = `translateY(${translateY}px)`;
  }

  // 状态与UI微调 (根据滚动进度分段控制)
  if (progress < 0.25) {
    // 晨曦
    if (timeDisplay) timeDisplay.textContent = "07:00 AM (DAWN)";
    if (sunGlow) sunGlow.style.backgroundColor = "rgba(254, 215, 170, 0.9)";
    if (lampLight) lampLight.style.backgroundColor = "rgba(253, 230, 138, 0)";
    if (bodyContainer) bodyContainer.classList.remove('dark-mode');
  } else if (progress < 0.55) {
    // 正午
    if (timeDisplay) timeDisplay.textContent = "12:00 PM (MIDDAY)";
    if (sunGlow) sunGlow.style.backgroundColor = "rgba(255, 255, 255, 1)";
    if (lampLight) lampLight.style.backgroundColor = "rgba(253, 230, 138, 0)";
    if (bodyContainer) bodyContainer.classList.remove('dark-mode');
  } else if (progress < 0.8) {
    // 黄昏
    if (timeDisplay) timeDisplay.textContent = "06:30 PM (SUNSET)";
    if (sunGlow) sunGlow.style.backgroundColor = "rgba(249, 115, 22, 0.9)";
    if (lampLight) lampLight.style.backgroundColor = "rgba(253, 230, 138, 0.2)";
    if (bodyContainer) bodyContainer.classList.remove('dark-mode');
  } else {
    // 黑夜
    if (timeDisplay) timeDisplay.textContent = "10:00 PM (NIGHT)";
    if (sunGlow) sunGlow.style.backgroundColor = "rgba(224, 231, 255, 0.7)";
    if (lampLight) lampLight.style.backgroundColor = "rgba(253, 230, 138, 0.6)";
    if (bodyContainer) bodyContainer.classList.add('dark-mode');
  }
});
