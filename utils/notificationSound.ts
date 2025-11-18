// A simple utility to play a notification sound.
// Using a publicly available sound file to avoid adding new assets.

const NOTIFICATION_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/03/15/audio_221658a4d2.mp3';
let audio: HTMLAudioElement | null = null;

export const playNotificationSound = () => {
    try {
        if (!audio) {
            audio = new Audio(NOTIFICATION_SOUND_URL);
            audio.volume = 0.5; // Set a reasonable volume
        }
        // Play the sound
        audio.play().catch(error => {
            // Autoplay was prevented. This can happen if the user hasn't interacted with the page yet.
            console.warn("Notification sound was blocked by the browser:", error);
        });
    } catch (error) {
        console.error("Error playing notification sound:", error);
    }
};
