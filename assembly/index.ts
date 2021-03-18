// The entry file of your WebAssembly module.
memory.grow(1);

let universe_width: u32;
let universe_height: u32;
let alive_color: u32;
let dead_color: u32;
let chunk_offset: u32;

@inline
function getCell(x: u32, y: u32): u32 {
  return load<u32>((x + y * universe_width) << 2);
}

@inline
function setCell(x: u32, y: u32, val: u32): void {
  store<u32>(((x + y * universe_width) << 2) + chunk_offset, val);
}

@inline
function copyToPrimary(): void {
  memory.copy(0, chunk_offset, chunk_offset);
}

function fillUniverse(): void {
  for (let x: u32 = 0; x < universe_width; x++) {
    for (let y: u32 = 0; y < universe_height; y++) {
      setCell(x, y, Math.random() > 0.5 ? alive_color : dead_color);
    }
  }

  copyToPrimary();
}

export function init(width: u32, height: u32): void {
  universe_width = width;
  universe_height = height;

  alive_color = 0xffc39800;
  dead_color = 0xfff4f4f4;
  chunk_offset = width * height * 4;

  fillUniverse();
}

function countNeighbours(x: u32, y: u32): u32 {
  let neighbours = 0;

  const max_x = universe_width - 1;
  const max_y = universe_height - 1;

  const y_above = y == 0 ? max_y : y - 1;
  const y_below = y == max_y ? 0 : y + 1;
  const x_left = x == 0 ? max_x : x - 1;
  const x_right = x == max_x ? 0 : x + 1;

  // top left
  if(getCell(x_left, y_above) == alive_color) {
    neighbours++;
  }

  // top
  if(getCell(x, y_above) == alive_color) {
    neighbours++;
  }

  // top right
  if(getCell(x_right, y_above) == alive_color) {
    neighbours++;
  }

  // right
  if(getCell(x_right, y) == alive_color) {
    neighbours++;
  }

  // bottom right
  if(getCell(x_right, y_below) == alive_color) {
    neighbours++;
  }

  // bottom
  if(getCell(x, y_below) == alive_color) {
    neighbours++;
  }

  // bottom left
  if(getCell(x_left, y_below) == alive_color) {
    neighbours++;
  }

  // left
  if(getCell(x_left, y) == alive_color) {
    neighbours++;
  }

  return neighbours;
}

export function update(): void {
  for (let x: u32 = 0; x < universe_width; x++) {
    for (let y: u32 = 0; y < universe_height; y++) {

      const neighbours = countNeighbours(x, y);

      if (neighbours < 2) {
        // less than 2 neighbours, cell is no longer alive
        setCell(x, y, dead_color);
      } else if (neighbours == 3) {
        // cell will be alive
        setCell(x, y, alive_color);
      } else if (neighbours > 3) {
        // cell dies due to overpopulation
        setCell(x, y, dead_color);
      }

    }
  }
  copyToPrimary();
}
