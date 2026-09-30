# Footer:
<footer class="footer">
            <p class="footer-text"><b>Hortus Botanicus Haren Kerklaan 34 9751 NN Haren</b></p>
</footer>
(Not the footer anymore :)

# To add/ask:
- Metadata
- Page titles
- Metadata 
- Why did i do metadata twice
- Navbar layout mobile:
  - Center logo
  - Drawer button
     Opens drawer that holds the navigation buttons, because they won't fit on mobile.
- Fix video
  - Audio sync
  - Add audio slider
  - Fix play button transparency when hovered

## Done
- Hoe moet het met de quiz, moeten het meerdere plagina's zijn, en moeten ze per tuin zijn of gewoon algemeen, en hoe moet het er uit zien?
- Vertel: De nieuwste versie word automatisch geupdate op https://evyanalt.github.io/PlantQuiz/ , dus je kan daar altijd kijken hoe het er op dit moment uit ziet en als er iets veranderd moet worden gwn een mailtje sturen.
  Mijn idee op dit moment:
  home
    quizzen
      quiz blauw gele tuin
      quiz witte tuin
- Moet ik ook nog een pagina voor data maken? (dus grafieken enz)

# Colour storage
- Background old (before m3): #e4f7b7;   
- Navbar old (before m3): #556b2f

# Current Commit msg
22/09/2026 18:03 - Moved from onedrive
23/09/2026 from 21:32 - Changed navbar layout, and added buttons for pages.

# M3 video player playground
```
<div class="m3-player-container">
  <video class="m3-video" src="../media/video.mp4"></video>
  <button class="m3-center-play-btn" aria-label="Play">
    <span class="material-symbols-rounded">play_arrow</span>
  </button>
  <div class="m3-controls-bar">
    <button class="m3-icon-btn" id="play-pause-btn" aria-label="Play/Pause">
      <span class="material-symbols-rounded" id="play-icon">play_arrow</span>
    </button>
    <div class="m3-time-display">
      <span id="current-time">0:00</span> / <span id="duration">0:00</span>
    </div>
    <div class="m3-slider-container">
      <input type="range" class="m3-seek-slider" id="seek-slider" value="0" min="0" max="100" step="0.1">
    </div>
    <button class="m3-icon-btn" id="fullscreen-btn" aria-label="Fullscreen">
      <span class="material-symbols-rounded">fullscreen</span>
    </button>
  </div>
</div>
```

poster="idfk what this is.jpg"