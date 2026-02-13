import XTerminal from 'xterminal';
import { selectEvent } from './events';

declare global {
    var loadPyodide: any
}

const TAILWIND_STYLES = ["italic", "text-stone-400", "text-white", "text-stone-200"] as const;
type tailwind_styles = typeof TAILWIND_STYLES[number];
const term = new XTerminal();

export function startTerminal() {

    term.mount("#terminal");
    const terminalElement = document.getElementsByClassName("xt")[0];

    term.write("Hello World!\n");
    //term.clear();

    selectEvent("MOVE").onEvent(({ headingPrefix, currentMoveTo }: any) => {
        console.log("Moved to", headingPrefix, currentMoveTo)
    });

    selectEvent("NO_MOVE").onEvent(({}: any) => {
        console.log("Move is invalid")
    });

    selectEvent("CLICK").onEvent(() => {
        setTimeout(() => {
            // clicks are made on the canvas which takes focus away from the terminal, here we restore it
            terminalElement?.focus();
        }, 10);
    })

    writeLine(
        description("It is raining outside, rain pelts the roof of the tavern."),
        notable("There is an enemy here"),
        description("and then the rain can be heard again")
    );

    (async () => {
        let pyodide = await loadPyodide();

        const response = await fetch("terminal/movement.py");

        if (response.ok) {
            const pyCode = await response.text();

            console.log(pyCode);

            const output = pyodide.runPython(`${pyCode}`);
            console.log(output);
        }
    })();

}

function addPrefix() {
    term.write("[In Winterfell, July 4th 7:12pm] ");
}

function write(text: string, ...tailwind: tailwind_styles[]) {
    if (!tailwind?.length) return text;
    else return `<span class="${tailwind.join(' ')}">${text}</span>`;
}

function description(text: string) {
    return write(text, "italic", "text-stone-400");
}

function notable(text: string) {
    return write(text, "text-stone-200");
}

function warning(text: string) {
    return write(text, "text-stone-200");

}

function alert() {

}

function systemError() {

}

function writeLine(...output: string[]) {
    output.forEach((line) => {
        term.write(`${line}\n`)
    });

    addPrefix();
}




// You see a 


//5 each
/*
const building: {
    snow: [

    ],
    blizzard: [

    ],
    rain: [
        "The rain drizzles off the {}, spilling onto the ground, the eaves overflowing.",
        "The pitter patter of rain drops off the {}'s siding are as relaxing as they are annoying",

    ],

}
*/




const DATA_EVENT = "data" as const;
type EVENTS = typeof DATA_EVENT | string;

//term.clearLast();

term.on(DATA_EVENT, (data) => {
    // we should remove whitespace on either side
    console.log(data);
});

