const rooms = [...document.querySelectorAll('main > .room')];
const navLinks = [...document.querySelectorAll('.rooms a')];
let activeRoom;

function openRoom(moveFocus = false) {
  const id = location.hash.slice(1);
  if (id === 'main') return;
  const next = rooms.find(room => room.id === id) || rooms[0];
  if (next === activeRoom) return;
  rooms.forEach(room => {
    room.hidden = room !== next;
    room.classList.toggle('enter', room === next);
  });
  navLinks.forEach(link => {
    if (link.hash === '#' + next.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  activeRoom = next;
  if (moveFocus) {
    window.scrollTo(0, 0);
    const heading = next.querySelector('h1,h2');
    heading.tabIndex = -1;
    heading.focus({preventScroll: true});
  }
}

openRoom();
if (!activeRoom) {
  rooms.forEach((room, i) => { room.hidden = i !== 0; });
  activeRoom = rooms[0];
  navLinks[0].setAttribute('aria-current', 'page');
}
window.addEventListener('hashchange', () => openRoom(true));

const shelf = document.querySelector('[data-picker]');
const selectors = [...shelf.querySelectorAll('[data-select]')];
const projects = [...document.querySelectorAll('#projects > article')];
function showProject(button) {
  selectors.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  projects.forEach(project => { project.hidden = project.id !== button.dataset.select; });
}
showProject(selectors[0]);
shelf.addEventListener('click', event => {
  const button = event.target.closest('[data-select]');
  if (button) showProject(button);
});
shelf.addEventListener('keydown', event => {
  const index = selectors.indexOf(event.target);
  if (index < 0 || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? selectors.length - 1 :
    (index + selectors.length + (event.key === 'ArrowRight' ? 1 : -1)) % selectors.length;
  selectors[next].focus();
  showProject(selectors[next]);
});

const paletteToggle = document.getElementById('paletteToggle');
let palette = 'pink';
try { palette = localStorage.getItem('alysa-palette') === 'lavender' ? 'lavender' : 'pink'; } catch {}
function setPalette(value) {
  palette = value;
  document.body.dataset.palette = value;
  paletteToggle.setAttribute('aria-label', value === 'pink' ? 'Switch to lavender theme' : 'Switch to pink theme');
  paletteToggle.title = paletteToggle.getAttribute('aria-label');
  paletteToggle.textContent = value === 'pink' ? '✿' : '✧';
}
setPalette(palette);
paletteToggle.addEventListener('click', () => {
  setPalette(palette === 'pink' ? 'lavender' : 'pink');
  try { localStorage.setItem('alysa-palette', palette); } catch {}
});

const pinboard = document.getElementById('skillPins');
document.querySelectorAll('#skills .tags li').forEach(tag => {
  const label = tag.textContent;
  tag.textContent = '';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-pressed', 'false');
  tag.append(button);
  button.addEventListener('click', () => {
    const pinned = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!pinned));
    if (pinned) {
      pinboard.querySelectorAll('button').forEach(pin => { if (pin.dataset.label === label) pin.remove(); });
    } else {
      const placeholder = pinboard.querySelector('span');
      if (placeholder) placeholder.remove();
      const pin = document.createElement('button');
      pin.type = 'button';
      pin.dataset.label = label;
      pin.textContent = '✿ ' + label + ' ×';
      pin.title = 'Remove ' + label;
      pin.addEventListener('click', () => button.click());
      pinboard.append(pin);
    }
    if (!pinboard.children.length) {
      const prompt = document.createElement('span');
      prompt.textContent = 'Tap a skill above to pin it here ♡';
      pinboard.append(prompt);
    }
  });
});
const apps = [...document.querySelectorAll('.app-grid button')];
apps.forEach(app => app.addEventListener('click', () => {
  apps.forEach(item => item.setAttribute('aria-pressed', String(item === app)));
  document.getElementById('appDescription').textContent = app.textContent + ' — ' + app.dataset.app;
}));

const note = document.getElementById('home-note');
const noteTriggers = [...document.querySelectorAll('.note-trigger')];
let noteOpener;
function setNote(open, restoreFocus = true) {
  note.hidden = !open;
  noteTriggers.forEach(button => button.setAttribute('aria-expanded', String(open)));
  if (open) document.getElementById('note-title').focus({preventScroll: true});
  else if (restoreFocus) noteOpener?.focus();
}
noteTriggers.forEach(button => button.addEventListener('click', () => {
  if (note.hidden) {
    noteOpener = button;
    setNote(true);
  } else setNote(false);
}));
note.querySelector('.note-close').addEventListener('click', () => setNote(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !note.hidden && activeRoom?.id === 'top') setNote(false);
});
window.addEventListener('hashchange', () => {
  if (activeRoom?.id !== 'top') setNote(false, false);
});
const messages = [
  'I’m glad you stopped by. Make yourself at home! ♡',
  'A tiny reminder: little ideas are worth making.',
  'The Creations shelf is open whenever you feel curious.',
  'Here’s a little good luck for whatever you’re working on today. ♡',
];
let noteIndex = 0;
note.querySelector('.note-next').addEventListener('click', () => {
  noteIndex = (noteIndex + 1) % messages.length;
  document.getElementById('note-message').textContent = messages[noteIndex];
});
note.querySelector('.note-heart').addEventListener('click', event => {
  const button = event.currentTarget;
  const liked = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(liked));
  button.setAttribute('aria-label', liked ? 'Take back heart' : 'Leave a heart');
  if (liked && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heart = document.createElement('span');
    heart.className = 'heart-float';
    heart.textContent = '♡';
    heart.setAttribute('aria-hidden', 'true');
    button.parentElement.append(heart);
    setTimeout(() => heart.remove(), 700);
  }
});

document.getElementById('copyDiscord').addEventListener('click', async () => {
  const status = document.getElementById('copyStatus');
  try {
    await navigator.clipboard.writeText('sereiatalia_');
    status.textContent = 'Copied! See you on Discord ♡';
  } catch {
    status.textContent = 'You can copy the username here: sereiatalia_';
  }
});

document.getElementById('copyEmail').addEventListener('click', async () => {
  const email = 'alysajuliengvr@gmail.com';
  const status = document.getElementById('emailStatus');
  status.hidden = false;
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = 'Copied: ' + email + ' ♡';
  } catch {
    status.textContent = 'Select and copy: ' + email;
  }
});

try {
  const key = 'alysa-studio-visits';
  const sessionKey = 'alysa-studio-session';
  const saved = Number(localStorage.getItem(key));
  let visits = Number.isSafeInteger(saved) && saved >= 0 ? saved : 0;
  if (!sessionStorage.getItem(sessionKey) || visits === 0) {
    visits += 1;
    localStorage.setItem(key, String(visits));
    sessionStorage.setItem(sessionKey, '1');
  }
  document.getElementById('visitCount').textContent = String(visits).padStart(3, '0');
  document.getElementById('visitStamp').hidden = false;
} catch {
  // The studio still works if the browser blocks storage.
}
