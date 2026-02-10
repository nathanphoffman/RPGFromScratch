export async function generateFogLayer(CONFIG: Config) {

    const { WIDTH, HEIGHT, SIZE } = CONFIG;

    const canvas = document.getElementById('doodads') as HTMLCanvasElement;
    adjustCanvasSizeAndScale(canvas, CONFIG);
    
    const ctx = canvas.getContext("2d");
    if(!ctx) return;


    

}
