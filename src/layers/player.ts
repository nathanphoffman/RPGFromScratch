import { selectEvent, type MoveEvent } from "../events";
import { loadSpriteImage } from "../sprite";
import type { Axis, Config, Coord, Direction, Player } from "../types";
import { adjustCanvasSizeAndScale, futureCollisionOnAxis } from "../utility";

export async function generatePlayerCanvasLayer(CONFIG: Config, collisionMap: any) {

    const { SIZE } = CONFIG;

    const canvas = document.getElementById('player') as HTMLCanvasElement;

    if (!canvas) {
        console.error("Canvas does not exist");
        return;
    }

    adjustCanvasSizeAndScale(canvas, CONFIG);

    let player: Player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: SIZE
    };

    let currentMoveTo: Coord = [player.x, player.y];

    const moveEvent = selectEvent<MoveEvent>("MOVE");

    selectEvent("CLICK").onEvent(({ clickAt }: any) => {
        currentMoveTo = undoMoveToOffset(clickAt, CONFIG);
        const { headingPrefix } = getHeading(currentMoveTo, player, CONFIG);

        if (currentMoveTo.length > 0) {
            moveEvent.executeEvent({ headingPrefix, currentMoveTo, player });
        }
    });


    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = await loadSpriteImage("rogues-64.png", 2, 2, CONFIG);

    const noMoveEvent = selectEvent("NO_MOVE");

    selectEvent("NEXT_FRAME").onEvent(() => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas  

        if (currentMoveTo.length > 0) {
            const status = moveToCurrent(collisionMap, currentMoveTo, player, CONFIG);

            drawPlayer(player, ctx, img);
            //console.log(status);

            const currentMoveIsNotWherePlayerIs = currentMoveTo[0] !== player.x || currentMoveTo[1] !== player.y;

            if (status === "NO_MOVE" && currentMoveIsNotWherePlayerIs) {
                noMoveEvent.executeEvent({});
                drawErrorTo(currentMoveTo, ctx, CONFIG);
                currentMoveTo = [player.x, player.y];
            }
            else drawMoveTo(currentMoveTo, ctx, CONFIG);
        }
        else drawPlayer(player, ctx, img);

    });

}

function undoMoveToOffset(currentMoveTo: Coord, CONFIG: Config): Coord {
    const { SIZE } = CONFIG;
    const [x, y] = currentMoveTo;

    // the moveTo command must be offset by the upper right portion of the rectangle
    return [x - SIZE / 2, y - SIZE / 2]
}

function drawPlayer(player: Player, ctx: CanvasRenderingContext2D, img: any) {

    const { x, y, size } = player;
    
    // player is a square so both sizes for x and y scale are equal

    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.stroke();

    ctx.drawImage(img as any, x, y, size, size);
}

function drawMoveTo(currentMoveTo: Coord, ctx: CanvasRenderingContext2D, CONFIG: Config) {

    //console.log("currentmoveto is", currentMoveTo);

    const { SIZE } = CONFIG;
    //ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.strokeStyle = "tan";
    // we have to center on the square by taking 0.5 the size of a 64 space
    ctx.rect(Math.ceil(currentMoveTo[0] / SIZE - 0.5) * SIZE, Math.ceil(currentMoveTo[1] / SIZE - 0.5) * SIZE, SIZE, SIZE);
    ctx.stroke();
}

function drawErrorTo(currentMoveTo: Coord, ctx: CanvasRenderingContext2D, CONFIG: Config) {

    //console.log("currentmoveto is", currentMoveTo);

    const { SIZE } = CONFIG;

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.strokeStyle = "red";
    //ctx.lineWidth = 10;
    
    // we have to center on the square by taking 0.5 the size of a 64 space
    ctx.rect(Math.ceil(currentMoveTo[0] / SIZE - 0.5) * SIZE, Math.ceil(currentMoveTo[1] / SIZE - 0.5) * SIZE, SIZE, SIZE);
    ctx.fill();
    ctx.stroke();
}

let flipFlop = false;

function getHeading(currentMoveTo: Coord, player: any, CONFIG: Config) {

    const SIZE = CONFIG.SIZE;

    const [x1, y1] = [player.x, player.y];
    const [x2, y2] = currentMoveTo;
    const MOVE_ERROR = SIZE / 2;

    const isHeaded: Direction = {

        // keep north/south here so they come first in prefix generation
        north: y1 - MOVE_ERROR > y2,
        south: y1 + MOVE_ERROR < y2,

        west: x1 - MOVE_ERROR > x2,
        east: x1 + MOVE_ERROR < x2
    }

    const headingVertical = isHeaded.south || isHeaded.north;
    const headingHorizontal = isHeaded.east || isHeaded.west;

    const headingPrefix = Object.keys(isHeaded).reduce((prefix, heading) => {
        if (isHeaded[heading as keyof Direction]) {
            return prefix + String(heading)[0].toUpperCase();
        }
        else return prefix;
    }, "");

    return { headingPrefix, headingVertical, headingHorizontal, isHeaded };

}

function moveToCurrent(collisionMap: Coord[], currentMoveTo: Coord, player: any, CONFIG: Config, diagonalRetry: boolean = false): void | "NO_MOVE" {

    const { headingVertical, headingHorizontal, isHeaded } = getHeading(currentMoveTo, player, CONFIG);
    const headingDiagonal = headingHorizontal && headingVertical;

    // the movement is always equal to the size of the squares on the grid to lock the player in place
    const MOVE_AMOUNT = CONFIG.SIZE;

    const move = (axis: Axis, amount: number) => {

        const collisionDetected = collisionMap.find(coord => {

            // the static axis is the axis the player is not moving on (opposite from the player)
            const staticAxis = axis === "x" ? "y" : "x";

            const collisionOnMovingAxis = futureCollisionOnAxis(amount, player, coord, axis, CONFIG);
            const collisionOnStaticAxis = futureCollisionOnAxis(0, player, coord, staticAxis, CONFIG);

            return collisionOnStaticAxis && collisionOnMovingAxis;
        });

        if (collisionDetected) {

            // diagonals are chosen nback and forth for movement but sometimes choosing a different diagonal will free
            // collisions and allow for movement, like moving around a tree.  This retrys the pathing which by definition will
            // try another diagonal, a bit of a hack but an elegant solution nonetheless

            if(headingDiagonal && !diagonalRetry) return ()=>moveToCurrent(collisionMap, currentMoveTo, player, CONFIG, true);
            else return () => "NO_MOVE";
        }
        //else if (!axis) return () => "NO_MOVE";
        else return () => player[axis] += amount;
    }
    /*
      const collideWith: Direction = {
            west: collision("x", -MOVE_AMOUNT),
            east: collision("x", +MOVE_AMOUNT),
            south: collision("y", +MOVE_AMOUNT),
            north: collision("y", -MOVE_AMOUNT)
        }
    */
    const moveTo: Direction = {
        north: move("y", -MOVE_AMOUNT),
        south: move("y", +MOVE_AMOUNT),
        west: move("x", -MOVE_AMOUNT),
        east: move("x", +MOVE_AMOUNT),
    }

    if (headingDiagonal) {


        const moveHorizontal = flipFlop = !flipFlop;

        if (moveHorizontal) {
            if (isHeaded.west) return moveTo.west();
            else if (isHeaded.east) return moveTo.east();
        }
        else {
            if (isHeaded.south) return moveTo.south();
            else if (isHeaded.north) return moveTo.north();
        }
    }
    else {
        // only 1 move is relevant in this scenario the find exits early on truthy,
        // we just need to find which direction is truthy which is the purpose of the find loop

        const selectedDirection = Object.keys(isHeaded).find(direction => {
            if (!!isHeaded[direction as keyof Direction]) {
                return direction;
            }
        });

        if (selectedDirection && moveTo[selectedDirection as keyof Direction]) {
            return moveTo[selectedDirection as keyof Direction]();
        } else return undefined;
        
    }

}
