# Footer:
<footer class="footer">
            <p class="footer-text"><b>Hortus Botanicus Haren Kerklaan 34 9751 NN Haren</b></p>
</footer>
(Not the footer anymore :)

# Open local python port:
python -m http.server 8000
Then go to:
localhost:8000

# I probably should do something like gitignore so that my notes don't go public
# But then i won't be able to acess them on other devices
# Yeah but then i just use something else
# Whatever

# To add/ask:
- Fix video
  - Audio sync
  - Margin bottom
- Video button
  - Homepage
  - Navbar

## Done
- Hoe moet het met de quiz, moeten het meerdere plagina's zijn, en moeten ze per tuin zijn of gewoon algemeen, en hoe moet het er uit zien?
- Vertel: De nieuwste versie word automatisch geupdate op https://evyanalt.github.io/PlantQuiz/ , dus je kan daar altijd kijken hoe het er op dit moment uit ziet en als er iets veranderd moet worden gwn een mailtje sturen.
  Mijn idee op dit moment:
  home
    quizzen
      quiz blauw gele tuin
      quiz witte tuin
- Moet ik ook nog een pagina voor data maken? (dus grafieken enz)
- Navbar layout mobile:
  - Center logo
  - Drawer button
     Opens drawer that holds the navigation buttons, because they won't fit on mobile.
- Favicon
- Metadata
- Page titles
- Metadata 
- Why did i do metadata twice
- Fix video
  - Add audio slider
  - Fix play button transparency when hovered
  

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

# Current Focus
## Go towards content, not visuals
- Add a (research) results page
- Add explanations for answers
- Add a plants/insects page
- Fix ui playing animation every time a answer is selected
## Quiz revamp
Tell the user if the answer is correct directly after pressing next, and telling them why the correct answer the correct one is, instead of only revealing how they did at the end. This way they also learn and it actually gets interesting.
If the user did well, show "Dat ging goed! Wil je een andere quiz doen?" if they did fine show "Goed! Wil je een nieuwe quiz doen of deze opnieuw?" and if they did bad show "Owh niet helemaal, wil je het opnieuw proberen?" with corresponding buttons, so when they did bad it's a retry, good a different and a retry etc.
- Disable confirm exit when the quiz is finished or the user is at question 1
### Grades
0-3 = Bad, Show retry button, "Owh, niet helemaal, wil je het opnieuw doen?"
4-7 = Fine, Show different quiz and retry button "Prima! Wil je een andere quiz doen of deze opnieuw doen?"
8-10 = Good, Sow different quiz button "Dat ging goed! Wil je een andere quiz proberen?"

## Homepage revamp
Instead of directing users directly to the quiz, give a little explanation about the site, the project and have little paragraphs for each component, and the layout with the one paragraph text left icon/picture right, the next text right icon/picture left, etc.

## Insects page
A page containing the insects researched with information, pictures, etc.
Can also be linked in other pages like in the results.

## Plants page
There will be qr codes scattered around the hortus, that when scanned goes to our website on the plants page for the plant. The qr code has a little plant icon in the middle
### Overview page
When the plants page is opened the user will be led to a overview page, with a grid of plants and some quick info. When a card is clicked the user gets directed to that plant's page, and instead of making idividual .html files, it'll use evyanalt.github.io/PlantQuiz/planten?plant="plantname

## Results page
### Graphs
- Most visited plants
  Ranked bar chart of the plants we observed, with the most visited plants stand out and showing the count next to all of the records.
- Most active insect groups
  Compare the insect groups and focus on which groups visited the most plants.
- Garden comparison
  Compare the two gardens, looking at the insect groups visiting, the visited plants and which garden generally did better.
- Top 5 best and worst plants
  Do some more research on why these plants are the most/least visited, looking at flower shape, colour, and pollen and stuff.


## Small things
Fix footer covering content

# Progress planner
## Week 1 (28)
Find out the team situation, take a look at the data and adress what to actually make, with the content etc.
## Week 2 (29)
Start the conversion
Turn out research results into data, build the graphs, explain the results
## Week 3 (30)
Complete the educational content
Explain the data, give reccomendations for certain scenarios, etc
## Week 4 (31)
Finish styling and implement the video
## Week 5 (32)
Test, finalize and polish the site, asking team members for any small changes, and making it presentation ready.