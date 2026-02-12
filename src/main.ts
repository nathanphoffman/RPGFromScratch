//import './style.css'
//import typescriptLogo from './typescript.svg'
//import viteLogo from '/vite.svg'
//import { setupCounter } from './counter.ts'

import { setupCursor } from "./cursor";
import { selectEvent } from "./events";
import { generateBackgroundLayer } from "./layers/background";
import { generadeDoodadsLayer } from "./layers/doodads";
import { generateGridCanvasLayer } from "./layers/grid";
import { generatePlayerCanvasLayer } from "./layers/player";
import { playMusic } from "./sound";
import { startTerminal } from "./terminal";

import type { Config } from "./types";

(async () => {

  const CONFIG: Config = {
    SIZE: 64,
    WIDTH: Math.floor(64 * 14),
    HEIGHT: Math.floor(64 * 10),
    SCALE: 1
  }

  startTerminal();
  setupCursor();

  // the grid canvas lays on top as a chessboard as the highest z-index it also tracks click events
  generateGridCanvasLayer(CONFIG);



  await generateBackgroundLayer(CONFIG);
  const collisionMap = await generadeDoodadsLayer(CONFIG);
  const playerLoop = await generatePlayerCanvasLayer(CONFIG, collisionMap);

  //playMusic();

  // once all assets are loaded we start the game
  const gameLoop = () => {
    //if (playerLoop) playerLoop(collisionMap);

    // broadcasts to all logic to update
    selectEvent("NEXT_FRAME").executeEvent({});

    // start the game at approximately 4fps
    requestAnimationFrame(() => setTimeout(gameLoop, 250));
  }

  gameLoop();

})()