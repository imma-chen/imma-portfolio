// js/modules/parallax.js
// 鼠标在场景区域移动时，让插画层做轻微的错位位移，
// 制造"视角在跟随探索"的错觉（这是 Monument Valley / Monolith
// 这类插画风格网站常用的手法，不是真正的 3D 转动）。

export function initParallax(stageEl, layerEl, options = {}) {
  const strength = options.strength ?? 18; // 最大位移像素
  const rotateStrength = options.rotateStrength ?? 1.2; // 最大倾斜角度

  if (!stageEl || !layerEl) return;

  stageEl.addEventListener('mousemove', (event) => {
    const rect = stageEl.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1; // -1 ~ 1
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1; // -1 ~ 1

    const translateX = -nx * strength;
    const translateY = -ny * strength * 0.6; // 垂直方向位移幅度小一点，更自然
    const rotate = nx * rotateStrength;

    layerEl.style.transform =
      `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
  });

  stageEl.addEventListener('mouseleave', () => {
    layerEl.style.transform = 'translate(0, 0) rotate(0deg)';
  });
}
