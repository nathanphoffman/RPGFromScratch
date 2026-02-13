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
import { startTerminal } from "./terminal";
import { setupMusicPlayer } from "./sound";

import type { Config } from "./types";
import { startRain } from "./atmosphere/rain";

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

  // all the background layer does is display a flat color or texture
  await generateBackgroundLayer(CONFIG);

  // doodads is all of the visual details outside of the creatures like grass, trees, houses
  const collisionMap = await generadeDoodadsLayer(CONFIG);

  // the player layer is where all of the movement is configured and rendered for the player character(s)
  await generatePlayerCanvasLayer(CONFIG, collisionMap);

  setupMusicPlayer();

  //startRain();

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