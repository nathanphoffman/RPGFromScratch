import { selectEvent } from "./events";

const audio = document.getElementById("audio");

function playMusic() {
    if(!audio) return;
    audio.muted = true; // Mute before playing
    audio.play().then(() => {
        audio.muted = false; // Unmute after playback starts
    }).catch(error => {
        console.error('Error playing audio:', error);
        alert('Playback failed, please check your browser settings.');
    });
}

function pokeMusicPlayer() {
    if(audio?.paused) playMusic();
}

export function setupMusicPlayer() {

    // because of browser permissions, the music player is unable to play anything without a user event initiating it
    selectEvent("CLICK").onEvent(({ clickAt }: any) => { 
        pokeMusicPlayer();
    });

}