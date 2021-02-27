const welcomeBtns = {};
document.querySelectorAll('.welcome__btn').forEach((btn) => {
  welcomeBtns[btn.id] = btn;
});
const pages = {};
document.querySelectorAll('.page').forEach((page) => {
  pages[page.id] = page;
});

let width = document.querySelector('#width');

const current = {
  tool: 'axe',
  type: '',
  cursor: '',
};
// game
let rows;
let cols;

function randomCol(type) {
  return Math.floor(Math.random() * (cols - type.width));
}

let world = [];
const toolsbox = document.querySelector('.tools');
const inventory = {
  boxes: [],
  checkAvaliable() {
    return this.boxes.findIndex((box) => box.dataset.type === 'empty');
  },
  inventoryElement: document.querySelector('.inventory'),
  resetInventory() {
    const numOfInventoryBoxes = window.matchMedia(`only screen and (max-width: 850px) and (orientation: portrait)`)
      .matches
      ? 4
      : 8;
    this.inventoryElement.innerHTML = `
    <div class="inventory__box --border-color-secondary" data-type="empty"></div>
    `.repeat(numOfInventoryBoxes);
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
  hoe: {
    url: `./images/tools/hayHoeCursor.png`,
    blocks: ['hay'],
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
    height: 9,
    width: 8,
    drawTree() {
      const row = blocks.dirt.height;
      let col;
      do {
        col = randomCol(this);
      } while (!blocks.canBlockBePlaced(this.width, this.height, row, col));
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
    height: 1,
    width: 1,
    drawStone(height) {
      let row = blocks.dirt.height;
      let col;
      do {
        col = randomCol(this);
      } while (!blocks.canBlockBePlaced(this.width, height, row, col));
      for (row; row < blocks.dirt.height + height; row += 1) {
        world[row][col] = 'stone';
      }
    },
    url: './images/blocks/stoneBlock.png',
  },
  hay: {
    tool: 'hoe',
    width: 1,
    height: 1,
    drawHay(height) {
      let row = blocks.dirt.height;
      let col;
      do {
        col = randomCol(this);
      } while (!blocks.canBlockBePlaced(this.width, height, row, col));
      for (row; row < blocks.dirt.height + height; row += 1) {
        world[row][col] = 'hay';
      }
    },
    url: './images/blocks/hayBlock.png',
  },
  canBlockBePlaced(width, height, startRow, startCol) {
    for (let row = startRow; row < startRow + height; row += 1) {
      for (let col = startCol; col < startCol + width; col += 1) {
        if (world[row][col] !== 'sky') {
          return false;
        }
      }
    }
    return true;
  },
  gravitate(block) {
    if (block.dataset.type !== 'leaf') {
      const rowBlock = parseInt(block.dataset.row);
      const colBlock = parseInt(block.dataset.col);
      const under = document.querySelector(`[data-row='${rowBlock - 1}'][data-col='${colBlock}']`);
      if (under.dataset.type === 'sky') {
        setTimeout(() => {
          under.dataset.type = block.dataset.type;
          block.dataset.type = 'sky';
          this.gravitate(under);
        }, 300);
      }
    }
  },
};

function exit() {
  window.close();
}

function start() {
  width = parseInt(width.value);
  window.location = `./game.html?width=${width}`;
}

function welcome() {
  window.location = './';
}

function switchPage(e) {
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
function startWorldMatrix(width) {
  rows = 30;
  const worldWrapper = document.querySelector('.game__world-container');
  const cellHeight = parseInt(window.getComputedStyle(worldWrapper).height) / rows;
  worldContainer.style.width = `${(parseInt(window.getComputedStyle(worldWrapper).width) * width) / 100}px`;
  cols = Math.ceil(parseInt(worldContainer.style.width) / cellHeight);
  worldContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  worldContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  world = [];
  for (let row = 0; row < rows; row += 1) {
    const worldCol = [];
    for (let col = 0; col < cols; col += 1) {
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
}

function placeInventory(e) {
  const element = document.elementFromPoint(e.layerX, e.layerY);
  if (element.dataset.type === 'sky') {
    element.dataset.type = current.type;
    blocks.gravitate(element);
  } else {
    inventory.boxes[inventory.checkAvaliable()].dataset.type = current.type;
  }
  document.body.style.cursor = current.cursor;
  document.body.removeEventListener('mouseup', placeInventory);
  document.body.removeEventListener('touchend', placeInventory);
}

function dragInventory(e) {
  if (e.target.classList.contains('inventory__box') && e.target.dataset.type !== 'empty') {
    current.cursor = document.body.style.cursor;
    current.type = e.target.dataset.type;
    document.body.style.cursor = `url(${blocks[current.type].url}), grabbing`;
    e.target.dataset.type = 'empty';
    document.body.addEventListener('mouseup', placeInventory);
    document.body.addEventListener('touchend', placeInventory);
  } else if (e.target.classList.contains('inventory__box') && e.target.dataset.type === 'empty') {
    inventory.boxes.forEach((box) => box.classList.add('--red-color-border'));
    const currentCursor = document.body.style.cursor;
    worldContainer.addEventListener('pointerup', () => {
      document.body.style.cursor = currentCursor;
      inventory.boxes.forEach((box) => box.classList.remove('--red-color-border'));
    });
  }
}

const cloud = {
  height: 4,
  width: 7,
  startRow: 21,
  drawCloud() {
    const numOfClouds = Math.floor(Math.random() * Math.floor(cols / 25) + 1);
    document.querySelectorAll('.cloud').forEach((block) => block.classList.remove('cloud'));
    for (let counter = 0; counter < numOfClouds; counter += 1) {
      let row = cloud.startRow;
      let col;
      do {
        col = randomCol(cloud);
      } while (!blocks.canBlockBePlaced(cloud.width, cloud.height, row, col));
      const startCol = col;
      for (row = cloud.startRow; row < cloud.startRow + cloud.height - 1; row += 1) {
        for (col = startCol; col < startCol + cloud.width; col += 1) {
          worldContainer.querySelector(`[data-row='${row}'][data-col='${col}']`).classList.add('cloud') || null;
        }
      }
      for (col = startCol + 2; col < startCol + cloud.width - 2; col += 1) {
        worldContainer.querySelector(`[data-row='${row}'][data-col='${col}']`).classList.add('cloud') || null;
      }
    }
  },
};

function initialWorld() {
  startWorldMatrix(width);
  blocks.dirt.drawDirt();
  const numOfTrees = Math.random() * Math.floor(cols / 25);
  for (let i = 0; i < numOfTrees; i += 1) {
    blocks.tree.drawTree();
  }
  const numOfStones = Math.random() * Math.floor(cols / 5);
  for (let i = 0; i < numOfStones; i += 1) {
    blocks.stone.drawStone(Math.floor(Math.random() * 3) + 1);
  }
  const numOfHays = Math.random() * Math.floor(cols / 6);
  for (let i = 0; i < numOfHays; i += 1) {
    blocks.hay.drawHay(Math.floor(Math.random() * 3) + 1);
  }
  drawWorld();
}

function eventListenersSwitch(e) {
  if (window.location.pathname.match(/game/)) {
    const url = new URL(window.location.href);
    width = url.searchParams.get('width');
    width = width > 800 ? 800 : width < 100 ? 100 : isNaN(width) ? 100 : width;
    initialWorld();
    cloud.drawCloud();
    setInterval(cloud.drawCloud, 5000);
    welcomeBtns['reset-world'].addEventListener('click', drawWorld);
    welcomeBtns['new-world'].addEventListener('click', initialWorld);
    welcomeBtns['reset-game'].addEventListener('click', welcome);
    toolsbox.addEventListener('change', toolChange);
    worldContainer.addEventListener('pointerdown', worldClicked);
    setTimeout(() => toolsbox.querySelector(`input[type='radio']`).click(), 1);
    inventory.inventoryElement.addEventListener('mousedown', dragInventory);
    inventory.inventoryElement.addEventListener('touchstart', dragInventory);
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
