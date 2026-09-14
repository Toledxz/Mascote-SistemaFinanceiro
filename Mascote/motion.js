"use strict";
const mascot = document.querySelector('#mascot');
const zone = document.querySelector('#mascotZone');
const text = document.querySelector('#speechText');
const motionToggle = document.querySelector('#motionToggle');
const media = matchMedia('(prefers-reduced-motion: reduce)');
let paused = media.matches;
let gestureTimer, blinkTimer, blinkEnd, idleTimer, frame;
let particles = [];
const canvas = document.querySelector('#confettiCanvas');
const ctx = canvas.getContext('2d');
const messages = {
  wave: 'Olá! Que bom ter você por aqui.',
  think: 'Vamos pensar no próximo passo com calma…',
  tablet: 'Deixa eu dar uma olhadinha por aqui…',
  wink: 'Pode contar comigo!',
  celebrate: 'Você conseguiu! Vamos comemorar?'
};
const tips = ['Que tal organizar as tarefas financeiras da semana?', 'Registrar as movimentações ajuda a visualizar o mês.', 'Uma meta de cada vez: acompanhe seu progresso!', 'Vamos conferir as categorias do seu painel?'];
let tipIndex = 0;

function blink() {
  if (paused || document.hidden || mascot.dataset.gesture === 'wink') return;
  mascot.classList.remove('is-blinking');
  void mascot.getBoundingClientRect();
  mascot.classList.add('is-blinking');
  clearTimeout(blinkEnd);
  blinkEnd = setTimeout(() => mascot.classList.remove('is-blinking'), 260);
}
function schedule() {
  clearTimeout(blinkTimer);
  clearTimeout(idleTimer);
  if (paused || document.hidden) return;
  blinkTimer = setTimeout(function repeat() {
    blink();
    blinkTimer = setTimeout(repeat, 3200 + Math.random() * 2200);
  }, 3000);
  idleTimer = setTimeout(function idle() {
    if (!mascot.dataset.gesture) perform('tablet', false);
    idleTimer = setTimeout(idle, 16000);
  }, 16000);
}
function perform(gesture, announce = true, message) {
  clearTimeout(gestureTimer);
  delete mascot.dataset.gesture;
  mascot.classList.remove('is-blinking');
  clearTimeout(blinkEnd);
  if (announce) text.textContent = message || messages[gesture];
  document.querySelectorAll('[data-gesture].gesture-button').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.gesture === gesture));
  });
  if (!paused && !document.hidden) {
    void mascot.getBoundingClientRect();
    mascot.dataset.gesture = gesture;
    if (gesture === 'celebrate') confetti();
  }
  gestureTimer = setTimeout(() => {
    delete mascot.dataset.gesture;
    document.querySelectorAll('.gesture-button[data-gesture]').forEach(b => b.setAttribute('aria-pressed', 'false'));
  }, 2900);
}
function clearConfetti() {
  cancelAnimationFrame(frame);
  frame = null;
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function syncMotion() {
  document.body.classList.toggle('motion-paused', paused || document.hidden);
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Ativar movimentos' : 'Pausar movimentos';
  if (paused || document.hidden) {
    delete mascot.dataset.gesture;
    mascot.classList.remove('is-blinking');
    resetGaze();
    clearConfetti();
  }
  schedule();
}
document.querySelectorAll('.gesture-button[data-gesture]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => perform(button.dataset.gesture));
});
mascot.addEventListener('click', () => perform('wave'));
document.querySelector('#celebrateBtn').addEventListener('click', () => perform('celebrate'));
document.querySelector('#tipBtn').addEventListener('click', () => perform('talk', true, tips[tipIndex++ % tips.length]));
motionToggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
media.addEventListener('change', event => { paused = event.matches; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
function resetGaze() {
  for (const prop of ['--look', '--gaze-x', '--gaze-y']) mascot.style.removeProperty(prop);
}
zone.addEventListener('pointermove', event => {
  if (paused || event.pointerType === 'touch') return;
  const rect = zone.getBoundingClientRect();
  // offsetWidth is stable even while the decorative orbit rotates.
  const radius = zone.querySelector('.orbit--outer').offsetWidth / 2;
  const x = event.clientX - (rect.left + rect.width / 2);
  const y = event.clientY - (rect.top + rect.height / 2);
  if (Math.hypot(x, y) > radius) { resetGaze(); return; }
  mascot.style.setProperty('--look', `${x / radius * 2.5}deg`);
  mascot.style.setProperty('--gaze-x', `${x / radius * 16}px`);
  mascot.style.setProperty('--gaze-y', `${y / radius * 12}px`);
});
zone.addEventListener('pointerleave', resetGaze);
const theme = document.querySelector('#themeToggle');
try { document.body.classList.toggle('dark', localStorage.getItem('urcontab-theme') === 'dark'); } catch {}
theme.setAttribute('aria-pressed', String(document.body.classList.contains('dark')));
theme.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  theme.setAttribute('aria-pressed', String(dark));
  try { localStorage.setItem('urcontab-theme', dark ? 'dark' : 'light'); } catch {}
});
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize);
resize();
function confetti() {
  clearConfetti();
  const r = mascot.getBoundingClientRect();
  particles = Array.from({length:70}, (_,i) => ({x:r.left+r.width/2,y:r.top+r.height*.4,vx:(Math.random()-.5)*400,vy:-180-Math.random()*320,life:1,angle:Math.random()*6,color:['#D4AF62','#82B1D8','#1E4F78'][i%3]}));
  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now-last)/1000,.04); last=now;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for (const p of particles) {
      p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=480*dt; p.life-=dt*.55; p.angle+=dt*3;
      ctx.save(); ctx.globalAlpha=Math.max(0,p.life); ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.color;ctx.fillRect(-3,-5,6,10);ctx.restore();
    }
    particles=particles.filter(p=>p.life>0);
    if(particles.length) frame=requestAnimationFrame(tick); else clearConfetti();
  }
  frame=requestAnimationFrame(tick);
}
syncMotion();
