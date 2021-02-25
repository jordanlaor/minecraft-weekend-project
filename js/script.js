const welcomeBtns = {};
document.querySelectorAll('.welcome__btn').forEach((btn) => {
  welcomeBtns[btn.id] = btn;
});
const pages = {};
document.querySelectorAll('.page').forEach((page) => {
  pages[page.id] = page;
});

const root = document.querySelector(':root');

const current = {
  tool: '',
};

// Game consts
let rows;
let cols;
let world = [];
const toolsbox = document.querySelector('.tools');

const tools = {
  axe: {
    url: './images/tools/treeAxe.png',
  },
  pickaxe: {
    url: './images/tools/stonePickaxe.png',
  },
  shovel: {
    url: './images/tools/dirtShovel.png',
  },
};
const blocks = {
  dirt: {
    height: 0,
    tool: 'shovel',
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
    tool: 'axe',
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
  },
  stone: {
    tool: 'pickaxe',
    drawStone(startRow, startCol, width, height) {
      for (let row = startRow; row <= startRow + height; row += 1) {
        for (let col = startCol; col <= startCol + width; col += 1) {
          world[row][col] = 'stone';
        }
      }
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

function drawWorld() {
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      drawCell(row, col);
    }
  }
}

function toolChange(e) {
  [...toolsbox.children].forEach((toolwrapper) => {
    if (toolwrapper === e.target.parentElement && e.target.checked) {
      toolwrapper.classList.add('--bg-color-hover-btn');
      current.tool = e.target.id;
      document.body.style.cursor = `url(${tools[current.tool].url}), auto`;
    } else {
      toolwrapper.classList.remove('--bg-color-hover-btn');
    }
  });
}

function eventListenersSwitch(e) {
  if (window.location.pathname.match(/game/)) {
    startWorldMatrix();
    blocks.dirt.drawDirt();
    blocks.tree.drawTree(blocks.dirt.height, 2);
    blocks.stone.drawStone(blocks.dirt.height, 10, 2, 2);
    drawWorld();
    toolsbox.querySelector(`input[type='radio']`).click();
    welcomeBtns['reset-world'].addEventListener('click', drawWorld);
    toolsbox.addEventListener('change', toolChange);
  } else {
    welcomeBtns['welcome__btn-exit'].addEventListener('click', exit);
    welcomeBtns['welcome__btn-start'].addEventListener('click', start);
    welcomeBtns['welcome__btn-explanation'].addEventListener('click', switchPage);
    welcomeBtns['welcome__btn-back'].addEventListener('click', switchPage);
  }
}

window.addEventListener('load', eventListenersSwitch);
