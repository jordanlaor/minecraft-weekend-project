const welcomeBtns = {};
document.querySelectorAll('.welcome__btn').forEach((btn) => {
  welcomeBtns[btn.id] = btn;
});
const pages = {};
document.querySelectorAll('.page').forEach((page) => {
  pages[page.id] = page;
});

// Game consts
// Game
let rows;
let cols;
let world = [];

const blocks = {
  dirt: {
    height: 0,
    tool: '',
    drawDirt() {
      const dirtHeight = Math.ceil(rows / 4 > 4 ? rows / 4 : 4);
      for (let row = 0; row < dirtHeight; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          world[row][col] = 'dirt';
        }
      }
      this.height = dirtHeight;
    },
  },
  tree: {
    tool: '',
    drawTree(row, col) {
      for (let logRow = row; logRow < row + 4; logRow += 1) {
        world[logRow][col + 3] = 'log';
        world[logRow][col + 4] = 'log';
      }
      for (let leafCol = col; leafCol < col + 8; leafCol += 1) {
        world[row + 4][leafCol] = 'leaf';
        world[row + 5][leafCol] = 'leaf';
        world[row + 6][leafCol] = 'leaf';
      }
    },
    stone: {
      tool: '',
      drawStone(startRow, startCol, width, height) {
        for (let row = startRow; row <= startRow + height; row += 1) {
          for (let col = startCol; col <= startCol + width; col += 1) {
            world[row][col] = 'stone';
          }
        }
      },
    },
  },
};

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

function eventListenersSwitch(e) {
  if (window.location.pathname.match(/game/)) {
    startWorldMatrix();
    blocks.dirt.drawDirt();
    blocks.tree.drawTree(blocks.dirt.height, 2);
    blocks.stone.drawStone(blocks.dirt.height, 10, 2, 2);
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        drawCell(row, col);
      }
    }
  } else {
    welcomeBtns['welcome__btn-exit'].addEventListener('click', exit);
    welcomeBtns['welcome__btn-start'].addEventListener('click', start);
    welcomeBtns['welcome__btn-explanation'].addEventListener('click', switchPage);
    welcomeBtns['welcome__btn-back'].addEventListener('click', switchPage);
  }
}

window.addEventListener('load', eventListenersSwitch);
const worldContainer = document.querySelector('.game__world');

// game
function startWorldMatrix(inputCols = 30, inputRows = 30) {
  worldContainer.style.gridTemplateColumns = `repeat(${inputCols}, 1fr)`;
  worldContainer.style.gridTemplateRows = `repeat(${inputRows}, 1fr)`;
  rows = inputRows;
  cols = inputCols;
  world = [];
  for (let row = 0; row < inputRows; row += 1) {
    const worldCol = [];
    for (let col = 0; col < inputCols; col += 1) {
      worldCol.push('sky');
    }
    world.push(worldCol);
  }
}

function drawCell(row, col) {
  const cell = document.createElement('div');
  cell.setAttribute('data-type', world[row][col]);
  cell.setAttribute('data-row', `${row}`);
  cell.setAttribute('data-col', `${col}`);
  worldContainer.prepend(cell);
}
