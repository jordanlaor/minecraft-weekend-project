const welcomeBtns = {};
document.querySelectorAll('.welcome__btn').forEach((btn) => {
  welcomeBtns[btn.id] = btn;
});

function exit() {
  window.close();
}

welcomeBtns['welcome__btn-exit'].addEventListener('click', exit);
welcomeBtns['welcome__btn-start'].addEventListener('click', exit);
welcomeBtns['welcome__btn-exit'].addEventListener('click', exit);
