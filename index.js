const WIDTH = 128, HEIGHT = 128, FPS = 10;

const runWasm = async () => {
  const importObject = {
    env: {
      seed: Date.now,
      abort: () => console.log('aborting!')
    }
  };
  const module = await WebAssembly.instantiateStreaming(fetch('./build/optimized.wasm'), importObject);
  const exports = module.instance.exports;

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  exports.init(WIDTH, HEIGHT);

  const memoryBuffer = exports.memory.buffer;
  const memoryArray = new Uint8ClampedArray(memoryBuffer)
  
  const imageData = ctx.createImageData(WIDTH, HEIGHT);

  const step = () => {
    exports.update();
  
    imageData.data.set(memoryArray.slice(0, WIDTH * HEIGHT * 4));
    ctx.putImageData(imageData, 0, 0);
  
    setTimeout(step, 1000 / FPS);
  };
  step();

}
runWasm();
