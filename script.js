const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
const rooms = new Set(['top','about','work','skills','journey','contact']);
function enterRoom(id) {
  const room = rooms.has(id) ? id : 'top';
  document.body.dataset.view = room;
  document.querySelectorAll('.header nav a').forEach(link => {
    if (link.hash === '#' + room) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  menu.textContent = '☰';
  window.scrollTo({top:0,behavior:'instant'});
  document.title = (room === 'top' ? 'Alysa Julien Guevarra' : room[0].toUpperCase()+room.slice(1)+' · Alysa') + ' | Digital Portfolio';
}
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.textContent = open ? '×' : '☰';
});
window.addEventListener('hashchange', () => enterRoom(location.hash.slice(1)));
enterRoom(location.hash.slice(1));

const cards = [...document.querySelectorAll('#projectCarousel .project')];
let projectIndex = 0;
function showProject(index) {
  projectIndex = (index + cards.length) % cards.length;
  cards.forEach((card,i) => {
    card.classList.toggle('active', i === projectIndex);
    card.setAttribute('aria-hidden', String(i !== projectIndex));
    card.tabIndex = i === projectIndex ? 0 : -1;
  });
  document.querySelector('#projectPosition').textContent =
    String(projectIndex+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
}
document.querySelector('#prevProject').addEventListener('click', () => showProject(projectIndex-1));
document.querySelector('#nextProject').addEventListener('click', () => showProject(projectIndex+1));
document.addEventListener('keydown', event => {
  if (document.body.dataset.view !== 'work') return;
  if (event.key === 'ArrowRight') showProject(projectIndex+1);
  if (event.key === 'ArrowLeft') showProject(projectIndex-1);
});
showProject(0);

document.querySelector('#copyDiscord').addEventListener('click', async () => {
  const status = document.querySelector('#copyStatus');
  try {
    await navigator.clipboard.writeText('sereiatalia_');
    status.textContent = 'Copied! See you on Discord ♡';
  } catch {
    status.textContent = 'Username: sereiatalia_';
  }
});
