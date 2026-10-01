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
  const volumeBtn = document.getElementById('volume-btn');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const currentTimeLabel = document.getElementById('current-time');
  const durationLabel = document.getElementById('duration');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const centerPlayBtn = document.querySelector('.m3-center-play-btn');

  if (!video || !playPauseBtn || !playIcon || !seekSlider) {
    return;
  }

  if (!Number.isFinite(video.volume) || video.volume <= 0) {
    video.volume = 0.8;
  }

  video.muted = video.muted || false;

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

  const updateVolumeState = () => {
    if (!volumeBtn || !volumeIcon || !volumeSlider) {
      return;
    }

    const volumeToDisplay = video.muted ? 0 : Math.min(Math.max(video.volume || 0, 0), 1);
    volumeSlider.value = String(Math.round(volumeToDisplay * 100));

    if (volumeToDisplay === 0) {
      volumeIcon.textContent = 'volume_off';
      volumeBtn.setAttribute('aria-label', 'Unmute audio');
    } else if (volumeToDisplay < 0.5) {
      volumeIcon.textContent = 'volume_down';
      volumeBtn.setAttribute('aria-label', 'Mute audio');
    } else {
      volumeIcon.textContent = 'volume_up';
      volumeBtn.setAttribute('aria-label', 'Mute audio');
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

  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      video.muted = !video.muted;

      if (!video.muted && (video.volume === 0 || !Number.isFinite(video.volume))) {
        video.volume = 0.8;
      }

      updateVolumeState();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const nextVolume = Number(volumeSlider.value) / 100;
      video.volume = Math.min(Math.max(nextVolume, 0), 1);
      video.muted = nextVolume === 0;
      updateVolumeState();
    });
  }

  video.addEventListener('loadedmetadata', () => {
    updateTimeDisplay();
    updateVolumeState();
  });
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
  updateVolumeState();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeVideoPlayer);
} else {
  initializeVideoPlayer();
} 
