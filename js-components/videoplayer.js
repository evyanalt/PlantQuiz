// M3 styled video player

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${remainingSeconds}`;
};

const initializeVideoPlayer = () => {
  const video = document.querySelector('.m3-video');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const seekSlider = document.getElementById('seek-slider');
  const currentTimeLabel = document.getElementById('current-time');
  const durationLabel = document.getElementById('duration');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const centerPlayBtn = document.querySelector('.m3-center-play-btn');

  if (!video || !playPauseBtn || !playIcon || !seekSlider) {
    return;
  }

  const playerContainer = video.closest('.m3-player-container');
  const centerPlayIcon = centerPlayBtn ? centerPlayBtn.querySelector('.material-symbols-outlined') : null;

  const updatePlayButtonState = () => {
    const isPaused = video.paused;
    playIcon.textContent = isPaused ? 'play_arrow' : 'pause';

    if (centerPlayIcon) {
      centerPlayIcon.textContent = isPaused ? 'play_arrow' : 'pause';
    }

    if (centerPlayBtn) {
      centerPlayBtn.setAttribute('aria-label', isPaused ? 'Play' : 'Pause');
      centerPlayBtn.classList.toggle('hidden', !isPaused);
    }

    if (playerContainer) {
      playerContainer.classList.toggle('is-playing', !isPaused);
    }
  };

  const updateTimeDisplay = () => {
    if (currentTimeLabel) {
      currentTimeLabel.textContent = formatTime(video.currentTime);
    }

    if (durationLabel) {
      durationLabel.textContent = formatTime(video.duration);
    }

    if (Number.isFinite(video.duration) && video.duration > 0) {
      const progress = (video.currentTime / video.duration) * 100;
      seekSlider.value = progress || 0;
    } else {
      seekSlider.value = 0;
    }
  };

  const togglePlayback = async () => {
    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error('Video playback failed:', error);
      }
    } else {
      video.pause();
    }

    updatePlayButtonState();
  };

  playPauseBtn.addEventListener('click', togglePlayback);

  if (centerPlayBtn) {
    centerPlayBtn.addEventListener('click', togglePlayback);
  }

  if (seekSlider) {
    seekSlider.addEventListener('input', () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      const time = (Number(seekSlider.value) / 100) * video.duration;
      video.currentTime = time;
      updateTimeDisplay();
    });
  }

  video.addEventListener('loadedmetadata', updateTimeDisplay);
  video.addEventListener('timeupdate', updateTimeDisplay);
  video.addEventListener('play', updatePlayButtonState);
  video.addEventListener('pause', updatePlayButtonState);
  video.addEventListener('ended', updatePlayButtonState);

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', async () => {
      if (!playerContainer) {
        return;
      }

      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await playerContainer.requestFullscreen();
        }
      } catch (error) {
        console.error('Fullscreen toggle failed:', error);
      }
    });
  }

  updatePlayButtonState();
  updateTimeDisplay();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeVideoPlayer);
} else {
  initializeVideoPlayer();
} 
