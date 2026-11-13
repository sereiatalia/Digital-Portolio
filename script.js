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

document.querySelector('[data-note]').addEventListener('click', event => {
  const button = event.currentTarget;
  const note = document.getElementById(button.dataset.note);
  note.hidden = !note.hidden;
  button.setAttribute('aria-expanded', String(!note.hidden));
  button.textContent = note.hidden ? '♡ Open a little note' : '♡ Fold the note';
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
