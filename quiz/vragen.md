# Vragen

## Blauwe gele tuin

### 4-Choice

- Welke van deze planten is het beste voor verstuiving?
    1. Zonnehoed
    2. Blauwe knoop
    3. Reuze zonnebloem     < Vanwege de grote hoeveelheiden stuifmeel/pollen die deze plant heeft is deze zeer goed voor bestuiving.
    4. Aster incisius fisch 
- Op welke van deze planten zitten gemiddeld de meeste insecten?
    1. Lobelia
    2. Blauwe knoop
    3. Aster incisius fisch
    4. Virginische lobelia  < Uit ons onderzoek blijkt dat de Virginische lobelia de meeste insecten aan trekt.

### 2-Choice

## Witte tuin
- Welke van deze planten is het beste voor verstuiving?
    1. Prachtkaars 
    2. Pendula
    3. Witte troswederik
    4. Japanse sneeuwbal
- Op welke van deze planten zitten gemiddeld de meeste insecten?
    1. Pendula
    2. Sneeuw aster 
    3. Prachtkaars        < Uit ons onderzoek blijkt dat de Prachtkaars de meeste insecten aan trekt.
    4. Japanse sneeuwbal

# Question Templates

## 4-Choice

- Welke van deze planten is het beste voor verstuiving?
    1. 
    2. 
    3. 
    4.  
- Op welke van deze planten zitten gemiddeld de meeste insecten?
    1. 
    2. 
    3. 
    4. 
- Welke van deze bloemen trekt de meeste insecten aan, denk je?
    1.
    2.
    3.
    4.

## 2-Choice

- Welke van deze twee bloemen is <b>wel</b> goed voor insecten, denk je?
    - 
    - 
- Komen hier meer (insect 1) of meer (insect 2)?
    - 
    - 
- Welk insect komt het meest op de (naam bloem) bloem, denk je?
    - 
    - 
- Waarom zijn er zoveel bijen bij de gele bloemen (naam paar bloemen)? 
    - 
    -
- Bij welke van deze bloemen komen de meeste wilde bijen? 
    - 
    - 

# Quiz plan
## Basics
This quiz system will be complicated. A json file will be read via javascript for the quiz, after that the html page will be built with the questions from the json.
## Selector
The quiz/index.html will be a selector for the quiz, which will send the selected quiz to the /quiz.html page, which then lets javascript generate the html for each question.
## Appearance
The page will just have the default navbar. There will be the title, questions, next/submit/whatever and back buttons, and the progress.
After the quiz is done the user will be greeted with a screen showing how well they did, and asking if they want to restart or do a different
## Behaviour
The user will be greeted with a randomly selected question from the json file, and after ~10 questions the quiz ends. The site will of course mark the questions as done after they've been shown to the user, avoiding the same questions multiple times. After the quiz ends the completed questions will reset/clear, so next time they can appear again.
## Json layout
{
  "quiz": "temp:,
  "questions": [
    {
      "type": "4 Choice",
      "question": "Welke van deze planten is het beste voor verstuiving?",
      "options": ["Zonnehoed", "Blauwe Knoop", "Reuzenzonnebloem", "Aster incisius fisch"],
      "correct": "Reuzenzonnebloem"
    },
    {
      "type": "4 Choice",
      "question": "Op welke van deze planten zitten gemiddeld de meeste insecten?",
      "options": ["Lobelia", "Blauwe knoop", "Aster incisius fisch", "Virginische lobelia"],
      "correct": "Virginische lobelia"
    }
  ]
}