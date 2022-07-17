# Game of life

A [game of life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life) simulation in [WebAssembly](https://webassembly.org) made using [AssemblyScript](https://assemblyscript.org).

Accompanying article: https://opensource.com/article/21/4/game-life-simulation-webassembly

## Running

To run the demo locally, clone the project and run the following commands in the directory:

```sh
npm install
npm run asbuild
```

This generates wasm files inside `build` which can be run using the `index.html` file on a browser.
