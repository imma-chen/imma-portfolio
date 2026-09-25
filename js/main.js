// js/main.js

// ==================== 1. 初始化 LUCIDE 图标 ====================
if (window.lucide) {
  window.lucide.createIcons();
}

// ==================== 2. MONOLITH 加载动画逻辑 ====================
const loaderElement = document.getElementById('loader');
const welcomeTextElement = document.getElementById('welcome-text');
const progressBarFill = document.getElementById('progress-bar-fill');

let targetProgress = 0;   // 目标进度
let currentProgress = 0;  // 实际平滑显示的进度

// 页面加载开始时锁定滚动
document.body.style.overflow = 'hidden';

// 平滑数字递增与 WELCOME 文字填充循环
function updateLoader() {
  if (currentProgress < targetProgress) {
    currentProgress += 1;

    // WELCOME 文字按当前进度从左到右填充颜色 (对应 CSS 中的 --progress 变量)
    if (welcomeTextElement) {
      welcomeTextElement.style.setProperty('--progress', currentProgress);
    }
    if (progressBarFill) progressBarFill.style.width = `${currentProgress}%`;
  }

  // 到达 100% 后平滑淡出并解封页面滚动
  if (currentProgress >= 100) {
    setTimeout(() => {
      if (loaderElement) {
        loaderElement.classList.add('loaded');
      }
      document.body.style.overflow = 'auto'; // 恢复页面滚动
    }, 400);
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
const lampLight = document.getElementById('lamp-light'); // 2D 版台灯光晕，若已被 3D 场景取代则为 null，下面做了空值保护
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


// ==================== 4. 3D 互动桌面场景 (Three.js) ====================
function initDeskScene() {
  const container = document.getElementById('desk-3d-container');
  const canvas = document.getElementById('desk-canvas');
  if (!container || !canvas || !window.THREE) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    32,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  const baseCameraPos = new THREE.Vector3(0, 1.6, 6.2);
  camera.position.copy(baseCameraPos);
  camera.lookAt(0, 0.1, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ---- 灯光 ----
  const ambient = new THREE.AmbientLight(0xffe8cc, 0.55);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xffcf9c, 1.3, 14);
  keyLight.position.set(-1.6, 2.4, 1.8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xbcd4ff, 0.35);
  rimLight.position.set(2.5, 3, -2);
  scene.add(rimLight);

  // ---- 桌面 ----
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(8.6, 0.2, 3),
    new THREE.MeshStandardMaterial({ color: 0x2a2420, roughness: 0.75, metalness: 0.05 })
  );
  desk.position.y = -0.6;
  scene.add(desk);

  // ---- 台灯 ----
  const lampGroup = new THREE.Group();
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.3, 0.08, 24),
    new THREE.MeshStandardMaterial({ color: 0x1c1a18, roughness: 0.5 })
  );
  lampBase.position.y = -0.46;
  lampGroup.add(lampBase);

  const lampPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.4, 12),
    new THREE.MeshStandardMaterial({ color: 0x1c1a18 })
  );
  lampPole.position.y = 0.24;
  lampGroup.add(lampPole);

  const lampShade = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 0.4, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0x2a2420, side: THREE.DoubleSide })
  );
  lampShade.position.y = 0.95;
  lampShade.rotation.x = Math.PI;
  lampGroup.add(lampShade);

  const bulb = new THREE.PointLight(0xffd699, 1.1, 4.5);
  bulb.position.y = 0.85;
  lampGroup.add(bulb);

  lampGroup.position.set(-2.6, 0, -0.3);
  scene.add(lampGroup);

  // ---- 马克杯 ----
  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.18, 0.4, 24),
    new THREE.MeshStandardMaterial({ color: 0x3f3a36, roughness: 0.4 })
  );
  mug.position.set(-1.2, -0.28, 0.4);
  scene.add(mug);

  const mugHandle = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.03, 8, 24, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x3f3a36 })
  );
  mugHandle.position.set(-0.98, -0.28, 0.4);
  mugHandle.rotation.y = Math.PI / 2;
  scene.add(mugHandle);

  // ---- 笔记本电脑 ----
  const laptopBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.05, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x4a4540, roughness: 0.4, metalness: 0.3 })
  );
  laptopBase.position.set(0.4, -0.46, 0.1);
  scene.add(laptopBase);

  const laptopScreen = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.75, 0.04),
    new THREE.MeshStandardMaterial({
      color: 0x0d0d0e,
      emissive: 0x3a5a8c,
      emissiveIntensity: 0.5,
      roughness: 0.3
    })
  );
  laptopScreen.position.set(0.4, -0.08, -0.28);
  laptopScreen.rotation.x = -0.25;
  scene.add(laptopScreen);

  // ---- 笔记本 / 纸张 ----
  const notebook = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.04, 0.45),
    new THREE.MeshStandardMaterial({ color: 0xe8dfd0, roughness: 0.9 })
  );
  notebook.position.set(1.8, -0.47, 0.3);
  notebook.rotation.y = 0.3;
  scene.add(notebook);

  // ---- 绿植 ----
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.14, 0.25, 16),
    new THREE.MeshStandardMaterial({ color: 0x5c4a3c, roughness: 0.8 })
  );
  pot.position.set(2.6, -0.44, -0.4);
  scene.add(pot);

  const foliage = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.32, 0),
    new THREE.MeshStandardMaterial({ color: 0x4a6b4f, roughness: 0.85, flatShading: true })
  );
  foliage.position.set(2.6, -0.08, -0.4);
  scene.add(foliage);

  // ---- 鼠标驱动的视差交互 ----
  const targetTilt = { x: 0, y: 0 };

  container.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    targetTilt.y = nx * 0.6;
    targetTilt.x = ny * 0.15;
  });

  container.addEventListener('mouseleave', () => {
    targetTilt.x = 0;
    targetTilt.y = 0;
  });

  function animate() {
    requestAnimationFrame(animate);

    // 相机跟随鼠标做平滑视差移动，营造"探索桌面"的空间感
    camera.position.x += (baseCameraPos.x + targetTilt.y * 2.4 - camera.position.x) * 0.06;
    camera.position.y += (baseCameraPos.y - targetTilt.x * 1.1 - camera.position.y) * 0.06;
    camera.lookAt(0, 0.05, 0);

    // 台灯随鼠标位置轻微转动，增加生命感
    lampGroup.rotation.y += (targetTilt.y * 0.15 - lampGroup.rotation.y) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  // 容器尺寸变化时（例如窗口缩放）重新适配画布
  window.addEventListener('resize', () => {
    if (!container.clientWidth || !container.clientHeight) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// 等页面完全加载后再初始化 3D 场景，避免与 Monolith 加载动画抢资源
window.addEventListener('load', () => {
  initDeskScene();
});
