const assert = require('node:assert/strict');

function createElement(tagName = 'div', id = '') {
  const element = {
    tagName: tagName.toUpperCase(),
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    className: '',
    style: {},
    listeners: {},
    dataset: {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; }
    },
    addEventListener(type, handler) {
      this.listeners[type] = handler;
    },
    dispatch(type, event = {}) {
      if (this.listeners[type]) {
        this.listeners[type](event);
      }
    },
    querySelector() {
      return null;
    },
    closest() {
      return null;
    },
    setAttribute() {},
    getAttribute() { return null; }
  };

  return element;
}

const playIcon = createElement('span', 'play-icon');
const currentTime = createElement('span', 'current-time');
const duration = createElement('span', 'duration');
const seekSlider = createElement('input', 'seek-slider');
seekSlider.value = '0';

const video = createElement('video', 'video');
video.paused = true;
video.currentTime = 0;
video.duration = 120;
video.play = () => {
  video.paused = false;
  video.dispatch('play');
};
video.pause = () => {
  video.paused = true;
  video.dispatch('pause');
};

const playPauseBtn = createElement('button', 'play-pause-btn');
const fullscreenBtn = createElement('button', 'fullscreen-btn');
const centerPlayBtn = createElement('button');
centerPlayBtn.querySelector = () => ({ textContent: '' });

const documentMock = {
  querySelector(selector) {
    if (selector === '.m3-video') return video;
    if (selector === '.m3-center-play-btn') return centerPlayBtn;
    return null;
  },
  getElementById(id) {
    const map = {
      'play-pause-btn': playPauseBtn,
      'play-icon': playIcon,
      'seek-slider': seekSlider,
      'current-time': currentTime,
      'duration': duration,
      'fullscreen-btn': fullscreenBtn
    };
    return map[id] || null;
  },
  addEventListener() {},
  fullscreenElement: null
};

global.document = documentMock;

delete require.cache[require.resolve('../js-components/videoplayer.js')];
require('../js-components/videoplayer.js');

playPauseBtn.dispatch('click');
assert.equal(video.paused, false, 'The video should play when the button is pressed.');
assert.equal(playIcon.textContent, 'pause', 'The icon should switch to the pause state.');

video.currentTime = 45;
video.duration = 120;
video.dispatch('timeupdate');
assert.equal(currentTime.textContent, '0:45', 'The current time label should update.');
assert.equal(duration.textContent, '2:00', 'The duration label should show the video duration.');

console.log('videoplayer regression test passed');
