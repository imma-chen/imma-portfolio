// js/modules/loader.js
// 控制入场的 WELCOME 填充加载动画。

export function initLoader() {
  const loaderElement = document.getElementById('loader');
  const welcomeTextElement = document.getElementById('welcome-text');
  const progressBarFill = document.getElementById('progress-bar-fill');

  let targetProgress = 0;
  let currentProgress = 0;

  function tick() {
    if (currentProgress < targetProgress) {
      currentProgress += 1;

      if (welcomeTextElement) {
        welcomeTextElement.style.setProperty('--progress', currentProgress);
      }
      if (progressBarFill) {
        progressBarFill.style.width = `${currentProgress}%`;
      }
    }

    if (currentProgress >= 100) {
      setTimeout(() => {
        if (loaderElement) loaderElement.classList.add('loaded');
      }, 400);
    } else {
      requestAnimationFrame(tick);
    }
  }

  tick();

  // 模拟资源加载进度，50 毫秒递增 5%
  let simulatedProgress = 0;
  const timer = setInterval(() => {
    simulatedProgress += 5;
    targetProgress = simulatedProgress;
    if (simulatedProgress >= 100) clearInterval(timer);
  }, 50);
}
