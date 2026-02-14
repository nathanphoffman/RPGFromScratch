import { selectEvent, type MoveEvent } from "../events";
import type { Config } from "../types";
import { adjustCanvasSizeAndScale } from "../utility";

export async function generateFogLayer(CONFIG: Config) {

    //const { WIDTH, HEIGHT, SIZE } = CONFIG;

    const canvas = document.getElementById('doodads') as HTMLCanvasElement;
    adjustCanvasSizeAndScale(canvas, CONFIG);
    
    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    selectEvent<MoveEvent>("MOVE").onEvent(({ headingPrefix, currentMoveTo, player })=>{
        const x = player.x;
    });
    

}
