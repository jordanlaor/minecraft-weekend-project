const welcomeBtns = {};
document.querySelectorAll('.welcome__btn').forEach((btn) => {
  welcomeBtns[btn.id] = btn;
});

function exit() {
  window.close();
}

function start() {
  if (/index\.html$/i) {
    window.location = '../game.html';
  } else {
    window.location = './game.html';
  }
}

welcomeBtns['welcome__btn-exit'].addEventListener('click', exit);
welcomeBtns['welcome__btn-start'].addEventListener('click', start);
welcomeBtns['welcome__btn-exit'].addEventListener('click', exit);
