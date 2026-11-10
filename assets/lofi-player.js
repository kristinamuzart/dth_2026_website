
const audio = document.getElementById("lofiAudio");
const playButton = document.getElementById("lofiPlay");
const record = document.getElementById("vinylRecord");
const volume = document.getElementById("lofiVolume");

audio.volume = 0.4;

// Play or pause when the button is clicked
playButton.addEventListener("click", async () => {
    if (audio.paused) {
        try {
            await audio.play();
        } catch (error) {
            console.error("Music could not play:", error);
            alert("Could not play the music. Check your MP3 file.");
        }
    } else {
        audio.pause();
    }
});

// Keep the record and button synchronized
audio.addEventListener("play", () => {
    playButton.textContent = "❚❚";
    playButton.setAttribute("aria-label", "Pause music");
    record.classList.add("spinning");
});

audio.addEventListener("pause", () => {
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Play music");
    record.classList.remove("spinning");
});

// Volume control
volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});

// Minimize and expand the player

const minimizeButton = document.getElementById("lofiMinimize");
const player = document.getElementById("lofiPlayer");

minimizeButton.addEventListener("click", () => {
    const minimized = player.classList.toggle("minimized");

    minimizeButton.textContent = minimized ? "+" : "−";

    minimizeButton.setAttribute(
        "aria-label",
        minimized ? "Expand music player" : "Minimize music player"
    );

    minimizeButton.setAttribute(
        "aria-expanded",
        String(!minimized)
    );
});
