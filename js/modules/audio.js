// js/modules/audio.js
// 唱片机热区：点击切换背景音乐播放/暂停，并让指针动画落下/抬起。
//
// 注意：<audio id="bgm"> 目前没有音源，需要你把自己的音乐文件放进
// assets 文件夹（比如 assets/bgm.mp3），然后在 index.html 里把
// <source src="./assets/bgm.mp3" type="audio/mpeg"> 这一行的注释去掉。

export function initRecordPlayer() {
  const hotspot = document.getElementById('record-player-hotspot');
  const label = document.getElementById('record-player-label');
  const audio = document.getElementById('bgm');

  if (!hotspot || !audio) return;

  hotspot.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        hotspot.classList.add('playing');
        if (label) label.textContent = 'Pause Music';
      } else {
        audio.pause();
        hotspot.classList.remove('playing');
        if (label) label.textContent = 'Play Music';
      }
    } catch (err) {
      // 常见原因：还没有配置音源文件
      console.warn('播放失败，检查一下是否已经在 assets 里放了 bgm 文件：', err);
    }
  });
}
