const style = document.createElement('style');
style.textContent = `
.camera-view{position:relative}
.lens-sticker{position:absolute;inset:12% 0 auto;text-align:center;font-size:clamp(48px,10vw,92px);pointer-events:none;z-index:3;filter:drop-shadow(0 5px 10px #0006)}
.lens-hub{position:absolute;inset:10px;z-index:8;background:#171717ed;color:white;border:1px solid #ffffff24;border-radius:18px;padding:15px;overflow:auto;backdrop-filter:blur(12px)}
.lens-hub-head{display:flex;justify-content:space-between;align-items:center;font-weight:800}
.lens-hub button{cursor:pointer}
.lens-close{border:0;border-radius:50%;width:30px;height:30px;background:#ffffff20;color:white;font-size:20px}
.lens-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0 18px}
.lens-grid button,.lens-game-list button{border:1px solid #ffffff24;background:#ffffff12;color:white;border-radius:12px;padding:10px 5px;font-size:24px}
.lens-grid small,.lens-game-list small{display:block;font-size:10px;color:#ddd;margin-top:5px}
.lens-hub h3{font:700 14px Outfit;margin:12px 0 8px}
.lens-game-list{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lens-game-list button{text-align:left;font-size:13px;font-weight:700;padding:11px}
.lens-play{display:grid;gap:12px;text-align:center;place-content:center;min-height:230px}
.lens-play .score{font:800 38px Outfit;color:#fffc00}
.lens-play .play-button{border:0;border-radius:14px;background:#fffc00;color:#111;font-weight:800;padding:13px 18px}
.lens-play .back-game{border:1px solid #ffffff30;border-radius:12px;background:transparent;color:white;padding:9px}
.lens-status{font-size:12px;color:#ddd;min-height:18px}
`;
document.head.append(style);

function cameraTools() {
  const tools = document.querySelector('.camera-tools');
  if (!tools || tools.querySelector('[data-lenses-trigger]')) return;
  const button = document.createElement('button');
  button.className = 'tool-btn';
  button.type = 'button';
  button.dataset.lensesTrigger = 'true';
  button.innerHTML = '<span>☺</span><small>Linsen</small>';
  tools.insertBefore(button, tools.querySelector('.capture'));
}
const observer = new MutationObserver(cameraTools);
const appRoot = document.getElementById('app');
if (appRoot) observer.observe(appRoot, { childList: true, subtree: true });
cameraTools();

function hub() { return document.querySelector('.lens-hub'); }
function showHub() {
  const view = document.querySelector('.camera-view');
  if (!view) return;
  hub()?.remove();
  const panel = document.createElement('section');
  panel.className = 'lens-hub';
  panel.innerHTML = `
    <div class="lens-hub-head"><span>✨ Linsen & Mini-Spiele</span><button class="lens-close" data-lens-close>×</button></div>
    <p style="font-size:11px;color:#ccc">Tippe auf einen Effekt für deine Kamera.</p>
    <div class="lens-grid">
      <button data-lens-effect="🐶">🐶<small>Hund</small></button>
      <button data-lens-effect="👑">👑<small>Krone</small></button>
      <button data-lens-effect="🌈">🌈<small>Regenbogen</small></button>
      <button data-lens-effect="💖">💖<small>Herzen</small></button>
      <button data-lens-effect="✨">✨<small>Glitzer</small></button>
      <button data-lens-effect="🕶️">🕶️<small>Sonnenbrille</small></button>
    </div>
    <h3>Mini-Spiele</h3>
    <div class="lens-game-list">
      <button data-lens-game="egg">🥚 Ei-Timing<small>Tippe und sammle Punkte</small></button>
      <button data-lens-game="emoji">😀 Emoji-Paar<small>Finde das gleiche Symbol</small></button>
      <button data-lens-game="cloud">☁️ Wolken-Taps<small>Tippe so oft du kannst</small></button>
      <button data-lens-game="light">🚦 Ampel-Stopp<small>Nur bei Grün tippen</small></button>
    </div>`;
  view.append(panel);
}
function showGame(kind) {
  const panel = hub();
  if (!panel) return;
  const details = {
    egg: ['🥚 Ei-Timing', 'Tippe auf das Ei und sammle Punkte.', '🥚 Antippen'],
    emoji: ['😀 Emoji-Paar', 'Merke dir das Ziel und wähle dasselbe Symbol.', ''],
    cloud: ['☁️ Wolken-Taps', 'Wie viele Punkte schaffst du mit Tippen?', '☁️ Hüpfen'],
    light: ['🚦 Ampel-Stopp', 'Tippe nur, wenn die Ampel GRÜN zeigt.', 'Runde starten'],
  }[kind];
  if (kind === 'emoji') {
    const target = ['🍓','🌙','🐸','⭐'][Math.floor(Math.random()*4)];
    const choices = ['🍓','🌙','🐸','⭐'].sort(() => Math.random() - .5);
    panel.dataset.targetEmoji = target;
    panel.innerHTML = `<div class="lens-hub-head"><span>${details[0]}</span><button class="lens-close" data-lens-close>×</button></div>
      <div class="lens-play"><p>${details[1]}</p><div class="score">${target}</div><div class="lens-status" data-lens-status>Welches Symbol passt?</div>
      <div class="lens-grid">${choices.map((emoji) => `<button data-emoji-choice="${emoji}">${emoji}</button>`).join('')}</div>
      <div class="score" data-lens-score>0</div><button class="back-game" data-lens-back>← Zurück</button></div>`;
    return;
  }
  panel.innerHTML = `<div class="lens-hub-head"><span>${details[0]}</span><button class="lens-close" data-lens-close>×</button></div>
    <div class="lens-play"><p>${details[1]}</p><div class="score" data-lens-score>0</div><div class="lens-status" data-lens-status>Bereit?</div><button class="play-button" data-lens-play="${kind}">${details[2]}</button><button class="back-game" data-lens-back>← Zurück</button></div>`;
}
document.addEventListener('click', (event) => {
  if (event.target.closest('[data-lenses-trigger]')) { showHub(); return; }
  if (event.target.closest('[data-lens-close]')) { hub()?.remove(); return; }
  if (event.target.closest('[data-lens-back]')) { showHub(); return; }
  const effect = event.target.closest('[data-lens-effect]');
  if (effect) {
    const layer = document.getElementById('camera-overlay');
    if (layer) { layer.textContent = effect.dataset.lensEffect; layer.classList.add('lens-sticker'); }
    hub()?.remove();
    return;
  }
  const game = event.target.closest('[data-lens-game]');
  if (game) { showGame(game.dataset.lensGame); return; }
  const emojiChoice = event.target.closest('[data-emoji-choice]');
  if (emojiChoice) {
    const panel = hub();
    const status = panel?.querySelector('[data-lens-status]');
    const score = panel?.querySelector('[data-lens-score]');
    const correct = emojiChoice.dataset.emojiChoice === panel?.dataset.targetEmoji;
    if (status) status.textContent = correct ? 'Richtig! 🎉' : 'Fast! Schau dir das Ziel noch einmal an.';
    if (correct && score) score.textContent = String(Number(score.textContent || 0) + 1);
    if (correct) {
      const target = ['🍓','🌙','🐸','⭐'][Math.floor(Math.random()*4)];
      const choices = ['🍓','🌙','🐸','⭐'].sort(() => Math.random() - .5);
      panel.dataset.targetEmoji = target;
      panel.querySelector('.lens-play .score').textContent = target;
      panel.querySelector('.lens-grid').innerHTML = choices.map((emoji) => '<button data-emoji-choice="' + emoji + '">' + emoji + '</button>').join('');
    }
    return;
  }
  const play = event.target.closest('[data-lens-play]');
  if (!play) return;
  const kind = play.dataset.lensPlay;
  const score = hub()?.querySelector('[data-lens-score]');
  const status = hub()?.querySelector('[data-lens-status]');
  let points = Number(score?.textContent || 0);
  if (kind === 'emoji') {
    const target = ['🍓','🌙','🐸','⭐'][Math.floor(Math.random()*4)];
    const chosen = ['🍓','🌙','🐸','⭐'][Math.floor(Math.random()*4)];
    if (status) status.textContent = 'Ziel: ' + target + ' · gewählt: ' + chosen + (target === chosen ? ' ✓' : ' – versuch es erneut');
    if (target === chosen) points++;
  } else if (kind === 'light') {
    const green = Math.random() > .5;
    if (status) status.textContent = green ? '🟢 GRÜN – gut reagiert!' : '🔴 ROT – diesmal warten!';
    if (green) points++;
  } else {
    points++;
    if (status) status.textContent = kind === 'egg' ? 'Timing-Punkt gesammelt!' : 'Weiter so!';
  }
  if (score) score.textContent = String(points);
});
