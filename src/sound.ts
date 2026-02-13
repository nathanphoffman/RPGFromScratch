import { selectEvent } from "./events";

//const audio = document.getElementById("audio");
let currentAudio : HTMLAudioElement | undefined = undefined;

const music: string[] = [
    //"battle.mp3",
    "dungeon.mp3"
];

const effects: string[] = [
    "rain.mp3"
];

function getRandomSong() {
    const songPick = Math.ceil(Math.random() * music.length) - 1;
    return music[songPick];
}

function fetchLoadedSong(songName: string): HTMLAudioElement {
    console.log(songName);

    const PATH = "music"
    const audio = new Audio(`/${PATH}/${songName}`);

    return audio;
}

function playNewTrack() {
    const songName = getRandomSong();
    const newSong = fetchLoadedSong(songName);

    currentAudio = newSong;

    newSong.addEventListener('ended', function() { 
        playNewTrack();
    });

    newSong.play();
}

function pokeMusicPlayer() {
    if (!currentAudio) playNewTrack();
}

export function setupMusicPlayer() {

    // because of browser permissions, the music player is unable to play anything without a user event initiating it
    selectEvent("CLICK").onEvent(({ clickAt }: any) => {
        pokeMusicPlayer();
    });

}