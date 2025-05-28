const songs = [
    {
        title: "Big Wild - Maker",
        artist: "Big Wild",
        src: "Music/Big Wild - Maker - Big Wild.mp3",
        albumArt: "images/bigwildmaker.jpg"
    },
    {
        title: "Punctual - Castle (feat. World's First Cinema)",
        artist: "Punctual",
        src: "Music/Punctual - Castles (feat. World's First Cinema)_W9MPLNOI94A.mp3",
        albumArt: "images/punctual.jpg"
    },
    {
        title: "ODESZA - Corners Of The Earth (feat. RY X)",
        artist: "ODESZA",
        src: "Music/ODESZA - Corners Of The Earth (feat. RY X)_QOe09UlvKwY.mp3",
        albumArt: "images/odeszacorner.jpeg"
    }
];

const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const albumArt = document.getElementById('album-art');
const playlistElement = document.getElementById('playlist');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

let currentSongIndex = 0;

function loadSong(index, shouldPlay = false) {
    const song = songs[index];
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    audioPlayer.src = song.src;
    albumArt.src = song.albumArt;

    albumArt.onerror = () => {

        albumArt.src = "https://placehold.co/192x192/8B5CF6/FFFFFF?text=Music";
    };
    updatePlaylistHighlight(index);

    if (shouldPlay) {

        audioPlayer.removeEventListener('canplaythrough', playOnReadyHandler);

        audioPlayer.addEventListener('canplaythrough', playOnReadyHandler);
        audioPlayer.load();
    } else {
 
        audioPlayer.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

function playOnReadyHandler() {
    audioPlayer.play().then(() => {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }).catch(error => {
        if (error.name === 'AbortError') {
            console.log('Play request aborted (e.g., by new load or user interaction).');
        } else {
            console.error('Error playing audio:', error);
        }

        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });

    audioPlayer.removeEventListener('canplaythrough', playOnReadyHandler);
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        playOnReadyHandler();
    } else {
        audioPlayer.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;

    loadSong(currentSongIndex, !audioPlayer.paused);
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;

    loadSong(currentSongIndex, !audioPlayer.paused);
}

function populatePlaylist() {
    playlistElement.innerHTML = '';
    songs.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('song-list-item', 'flex', 'items-center', 'justify-between', 'p-3', 'rounded-lg', 'cursor-pointer', 'hover:bg-indigo-50', 'transition-colors', 'duration-200');
        listItem.setAttribute('data-index', index);

        const songInfo = document.createElement('div');
        songInfo.classList.add('flex-grow');
        songInfo.innerHTML = `
            <p class="font-medium text-gray-800 text-base">${song.title}</p>
            <p class="text-sm text-gray-500">${song.artist}</p>
        `;
        listItem.appendChild(songInfo);

        const playIconSmall = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        playIconSmall.classList.add('h-5', 'w-5', 'text-indigo-500', 'ml-3', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-200');
        playIconSmall.setAttribute('fill', 'none');
        playIconSmall.setAttribute('viewBox', '0 0 24 24');
        playIconSmall.setAttribute('stroke', 'currentColor');
        playIconSmall.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197 2.132A1 1 0 0110 13.82V9.18a1 1 0 011.555-.832l3.197 2.132a1 1 0 010 1.664z" />';
        listItem.appendChild(playIconSmall);

        listItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex, true);
        });
        playlistElement.appendChild(listItem);
    });
}

function updatePlaylistHighlight(activeIndex) {
    const listItems = playlistElement.querySelectorAll('.song-list-item');
    listItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('bg-indigo-100', 'shadow-sm');
            item.classList.remove('hover:bg-indigo-50');
        } else {
            item.classList.remove('bg-indigo-100', 'shadow-sm');
            item.classList.add('hover:bg-indigo-50');
        }
    });
}

playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audioPlayer.addEventListener('ended', nextSong);

window.onload = function() {
    loadSong(currentSongIndex, true);
    populatePlaylist();
};
