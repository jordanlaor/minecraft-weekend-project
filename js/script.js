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
  tool: 'axe',
  type: '',
  cursor: '',
};

// Game consts
let rows;
let cols;
let world = [];
const toolsbox = document.querySelector('.tools');
const inventory = {
  boxes: [],
  checkAvaliable() {
    return this.boxes.findIndex((box) => box.dataset.type === 'empty');
  },
  inventoryElement: document.querySelector('.inventory'),
  resetInventory() {
    this.inventoryElement.innerHTML = `
    <div class="inventory__box --border-color-secondary" data-type="empty"></div>
    `.repeat(8);
    inventory.boxes = [];
    document.querySelectorAll('.inventory__box').forEach((box) => {
      box.dataset.index = inventory.boxes.length;
      inventory.boxes.push(box);
    });
  },
};

const tools = {
  axe: {
    url: './images/tools/treeAxeCursor.png',
    blocks: ['leaf', 'log'],
  },
  pickaxe: {
    url: './images/tools/stonePickaxeCursor.png',
    blocks: ['stone'],
  },
  shovel: {
    url: `./images/tools/dirtShovelCursor.png`,
    blocks: ['dirt'],
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
    url: './images/blocks/dirtBlock.png',
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
        world[row + 7][leafCol] = 'leaf';
        world[row + 8][leafCol] = 'leaf';
      }
    },
  },
  leaf: {
    url: './images/blocks/leafBlock.png',
  },
  log: {
    url: './images/blocks/logBlock.png',
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
    url: './images/blocks/stoneBlock.png',
  },
};

function exit() {
  window.close();
}

function start() {
  window.location = './game.html';
}

function welcome() {
  window.location = './';
}

function switchPage(e) {
  console.log(e.target);
  if (e.currentTarget === welcomeBtns['welcome__btn-explanation']) {
    pages.welcome.classList.add('hidden');
    pages.settings.classList.add('hidden');
    pages.explanation.classList.remove('hidden');
  } else if (e.currentTarget === welcomeBtns['welcome__btn-back-explanation']) {
    pages.welcome.classList.remove('hidden');
    pages.settings.classList.add('hidden');
    pages.explanation.classList.add('hidden');
  } else if (e.currentTarget === welcomeBtns['welcome__btn-back-settings']) {
    pages.welcome.classList.remove('hidden');
    pages.settings.classList.add('hidden');
    pages.explanation.classList.add('hidden');
  } else if (e.currentTarget === welcomeBtns['welcome__btn-settings']) {
    pages.settings.classList.remove('hidden');
    pages.welcome.classList.add('hidden');
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
  inventory.resetInventory();
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

function worldClicked(e) {
  if (document.body.style.cursor.includes('tools')) {
    if (tools[current.tool].blocks.some((block) => block === e.target.dataset.type)) {
      const index = inventory.checkAvaliable();
      if (index >= 0) {
        inventory.boxes[index].dataset.type = e.target.dataset.type;
        e.target.dataset.type = 'sky';
      } else {
        const currentCursor = document.body.style.cursor;
        document.body.style.cursor = 'not-allowed';
        inventory.boxes.forEach((box) => box.classList.add('--red-color-border'));
        worldContainer.addEventListener('pointerup', () => {
          document.body.style.cursor = currentCursor;
          inventory.boxes.forEach((box) => box.classList.remove('--red-color-border'));
        });
      }
    } else {
      toolsbox.querySelector(`[for='${current.tool}']`).classList.add('--bg-color-red');
      setTimeout(() => toolsbox.querySelector(`[for='${current.tool}']`).classList.remove('--bg-color-red'), 300);
    }
  }
  // else if(document.body.style.cursor.includes('blocks')) {

  // }
}

function placeInventory(e) {
  const element = document.elementFromPoint(e.clientX, e.clientY);
  if (element.dataset.type === 'sky') {
    element.dataset.type = current.type;
  } else {
    inventory.boxes[inventory.checkAvaliable()].dataset.type = current.type;
  }
  document.body.style.cursor = current.cursor;
  document.body.removeEventListener('mouseup', placeInventory);
}

function dragInventory(e) {
  if (e.target.classList.contains('inventory__box') && e.target.dataset.type !== 'empty') {
    current.cursor = document.body.style.cursor;
    current.type = e.target.dataset.type;
    document.body.style.cursor = `url(${blocks[current.type].url}), grabbing`;
    e.target.dataset.type = 'empty';
    document.body.addEventListener('mouseup', placeInventory);
  } else if (e.target.classList.contains('inventory__box') && e.target.dataset.type === 'empty') {
    inventory.boxes.forEach((box) => box.classList.add('--red-color-border'));
    const currentCursor = document.body.style.cursor;
    worldContainer.addEventListener('pointerup', () => {
      document.body.style.cursor = currentCursor;
      inventory.boxes.forEach((box) => box.classList.remove('--red-color-border'));
    });
  }
}

function eventListenersSwitch(e) {
  if (window.location.pathname.match(/game/)) {
    startWorldMatrix();
    blocks.dirt.drawDirt();
    blocks.tree.drawTree(blocks.dirt.height, 2);
    blocks.stone.drawStone(blocks.dirt.height, 10, 2, 2);
    drawWorld();

    welcomeBtns['reset-world'].addEventListener('click', drawWorld);
    welcomeBtns['reset-game'].addEventListener('click', welcome);
    toolsbox.addEventListener('change', toolChange);
    worldContainer.addEventListener('pointerdown', worldClicked);
    setTimeout(() => toolsbox.querySelector(`input[type='radio']`).click(), 1);
    // TODO Add event listener for touch
    inventory.inventoryElement.addEventListener('mousedown', dragInventory);
  } else {
    welcomeBtns['welcome__btn-exit'].addEventListener('click', exit);
    welcomeBtns['welcome__btn-start'].addEventListener('click', start);
    welcomeBtns['welcome__btn-explanation'].addEventListener('click', switchPage);
    welcomeBtns['welcome__btn-settings'].addEventListener('click', switchPage);
    welcomeBtns['welcome__btn-back-settings'].addEventListener('click', switchPage);
    welcomeBtns['welcome__btn-back-explanation'].addEventListener('click', switchPage);
  }
}

window.addEventListener('load', eventListenersSwitch);
window.addEventListener('selectstart', (e) => e.preventDefault());
