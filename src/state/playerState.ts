
import type { Config, Player } from "../types";

let PLAYER : Player | undefined;

export function loadPlayer(CONFIG: Config) {

    const { WIDTH, HEIGHT } = CONFIG;

    if(!PLAYER) PLAYER = {
        x: Math.ceil(WIDTH / 2),
        y: Math.ceil(HEIGHT / 2),
        size: 64
    };

    return PLAYER;
}

export function setPlayer(newPlayer: Player) {
    PLAYER = newPlayer;
}