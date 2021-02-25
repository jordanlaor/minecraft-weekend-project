const welcomeBtns = {};
document.querySelectorAll('.welcome__btn').forEach((btn) => {
  welcomeBtns[btn.id] = btn;
});
const pages = {};
document.querySelectorAll('.page').forEach((page) => {
  pages[page.id] = page;
});

function exit() {
  window.close();
}

function start() {
  window.location = './game.html';
}

function switchPage(e) {
  if (e.currentTarget === welcomeBtns['welcome__btn-explanation']) {
    pages.welcome.classList.add('hidden');
    pages.explanation.classList.remove('hidden');
  } else {
    pages.welcome.classList.remove('hidden');
    pages.explanation.classList.add('hidden');
  }
}

welcomeBtns['welcome__btn-exit'].addEventListener('click', exit);
welcomeBtns['welcome__btn-start'].addEventListener('click', start);
welcomeBtns['welcome__btn-explanation'].addEventListener('click', switchPage);
welcomeBtns['welcome__btn-back'].addEventListener('click', switchPage);
