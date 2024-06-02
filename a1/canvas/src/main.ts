import { startSimpleKit, setSKDrawCallback, setSKAnimationCallback, SKMouseEvent, setSKEventListener, SKResizeEvent, skTime, addSKEventTranslator } from "simplekit/canvas-mode";
import { RedCat, BlueCat, GoldCat, GreyCat, GreenCat } from "./cat";
import { Star4, Star5, Star6, Star7, Star10 } from "./star";
import { Bullseye1, Bullseye2, Bullseye3, Bullseye4, Bullseye5 } from "./bullseye";
import { Card } from "./card";
import { Pattern } from "./pattern";
import { gestureTranslator } from "./gestureTranslator";
import { CallbackTimer } from "./timer";
import { animationManager, Animator, easeIn } from "./animationManager";
import { insideHitTestRectangle } from "simplekit/utility";


const MAX_PAIRS = 15;
const MIN_PAIRS = 1;
const patterns: (typeof Pattern)[] = [RedCat, BlueCat, GoldCat, GreyCat, GreenCat,
                 Star4, Star5, Star6, Star7, Star10,
                 Bullseye1, Bullseye2, Bullseye3, Bullseye4, Bullseye5];


let gameState = {
  mode: "start",
  pairs: 5,
  // list of Card
  cards: [] as Card[],
  matchedCards: [] as Card[],
  selectedCards: [] as Card[], 
};


let hasGeneratedCards = false;

let regenerateCardsRequired = true;

let startAnimationRequired = true;

let winJuggleAnimationAdded = false;

let cheatModeOn = false;

let selectedPatterns: (typeof Pattern)[] = [];

let timers: CallbackTimer[] = [];



startSimpleKit();

setSKAnimationCallback((time) => {
  animationManager.update(time);
  timers.forEach(timer => timer.update(time));
});

addSKEventTranslator(gestureTranslator);

setSKDrawCallback((gc) => {

  gc.clearRect(0, 0, gc.canvas.width, gc.canvas.height);

  drawBackground(gc);

  // Generate Cards
  if (!hasGeneratedCards) {
    selectedPatterns = shufflePatterns();
    hasGeneratedCards = true;
  }

  if (regenerateCardsRequired) {
    gameState.cards = [];
    refreshCards(gc.canvas.width, gc.canvas.height);
    regenerateCardsRequired = false;
  }

  //------------------------------------------------------------------------------
  // Start mode
  if (gameState.mode === "start") {
    drawStartMessage(gc);

    // Animate the cards when start mode is just entered
    if (startAnimationRequired) {
      for (const card of gameState.cards) {
        animateObject(card, gc.canvas.width / 2, gc.canvas.height / 2, card.x, card.y, 500);
      }
      startAnimationRequired = false;
    }

  }

  //------------------------------------------------------------------------------
  // Play mode
  else if (gameState.mode === 'play') {
    // Check if the selected cards match
    if (gameState.selectedCards.length == 2) {
      const [card1, card2] = gameState.selectedCards;
      if (card1.pattern.constructor.name === card2.pattern.constructor.name) {
        animateCardRotation(card1);
        animateCardRotation(card2);
        card1.matched = true;
        card2.matched = true;
        gameState.matchedCards.push(card1);
        gameState.matchedCards.push(card2);
        gameState.selectedCards = [];
      } 
    }

    // Check if all cards are matched
    if (gameState.matchedCards.length == gameState.pairs * 2) {
      gameState.mode = "win";
    }
  }

  //------------------------------------------------------------------------------
  // Win mode
  else if (gameState.mode === "win") {
    // Draw the message
    drawWinMessage(gc);

    for (let i = 0; i < gameState.cards.length; i++) {
      gameState.cards[i].faceUp = true;
      gameState.cards[i].matched = false;
      gameState.cards[i].hoveredOn = false;
    }

    if (!winJuggleAnimationAdded) {
      addJuggleAnimations();
    }

    winJuggleAnimationAdded = true;

  }

  //------------------------------------------------------------------------------


  for (const card of gameState.cards) {
    card.draw(gc);
  }

});
//------------------------------------------------------------------------------






setSKEventListener((e) => {
  switch (e.type) {
    case "gesture":
      const gestureEvent = e as SKMouseEvent;
      const endX = gestureEvent.x;
      const endY = gestureEvent.y;

      if (gameState.mode === "play") {
        peek(endX, endY);
      }
      break;

    case "resize":
      const resizeEvent = e as SKResizeEvent;
      const width = resizeEvent.width;
      const height = resizeEvent.height;

      if (selectedPatterns.length == 0) {
        selectedPatterns = shufflePatterns();
      }

      endLoopAnimations();
      refreshCards(width, height);

      if (gameState.mode === "win") {
        addJuggleAnimations();
      }

      hasGeneratedCards = true;
      break;



    case "mousemove":
      const { x, y } = e as SKMouseEvent;
      if (gameState.mode === "play") {
        gameState.cards.forEach((card) => {
          card.hoveredOn = insideHitTestRectangle(x, y, card.x - 40, card.y - 40, 80, 80);
        });
      } 
      break;

    case "click":
      const clickEvent = e as SKMouseEvent;
      const { x: clickX, y: clickY } = clickEvent;

      if (gameState.mode === "play" && !cheatModeOn) {
        for (const card of gameState.cards) {
          if (insideHitTestRectangle(clickX, clickY, card.x - 40, card.y - 40, 80, 80)) { // if the click is inside the card
            // if the card is not matched and is not in gameState.selectedCards and there are less than 2 cards in gameState.selectedCards
            if (!card.matched && !gameState.selectedCards.includes(card) && gameState.selectedCards.length < 2) {
              card.faceUp = true;
              gameState.selectedCards.push(card);
            } else if (gameState.selectedCards.includes(card)) { // if the card is already selected
              card.faceUp = false;
              if (cheatModeOn) {
                card.faceUp = true;
              }
              
              gameState.selectedCards.splice(gameState.selectedCards.indexOf(card), 1);
            }
          }
        }
      }
      break;

    case "keydown":
      const keyDownEvent = e as KeyboardEvent;
      if (keyDownEvent.key === " ") { // space key
        if (gameState.mode === "start") {
          gameState.mode = "play";
          setAllCardsFaceDirection(false);

          // Shuffle cards & play animation
          let cardIndices = [];
          for (let i = 0; i < gameState.pairs * 2; i++) {
            cardIndices.push(i);
          }
          // shuffle the array 
          cardIndices.sort(() => Math.random() - 0.5);

          let cardPositions = [];
          for (let i = 0; i < gameState.cards.length; i++) {
            let card = gameState.cards[i];
            cardPositions.push([card.x, card.y]);
          }

          for (let i = 0; i < gameState.cards.length; i++) {
            animateObject(
              gameState.cards[cardIndices[i]],
              cardPositions[cardIndices[i]][0],
              cardPositions[cardIndices[i]][1],
              gameState.cards[i].x,
              gameState.cards[i].y, 500
            );
          }

          // Order the cards based on the order in cardIndices
          let shuffledCards = [];
          for (let i = 0; i < cardIndices.length; i++) {
            shuffledCards.push(gameState.cards[cardIndices[i]]);
          }
          gameState.cards = shuffledCards;


        }
        else if (gameState.mode === "win") {
          gameState.mode = "start";
          gameState.pairs = Math.min(gameState.pairs + 1, MAX_PAIRS);
          gameState.matchedCards = [];
          gameState.selectedCards = [];

          hasGeneratedCards = false;
          regenerateCardsRequired = true;
          startAnimationRequired = true;

          winJuggleAnimationAdded = false;
          endLoopAnimations();
        }
      }

      

      if (keyDownEvent.key === "q") {
        if (gameState.mode === "play") {
          gameState.mode = "start";

          for (const card of gameState.cards) {
            card.matched = false;
            card.hoveredOn = false;
            card.faceUp = true;
          }
          gameState.matchedCards = [];
          gameState.selectedCards = [];
          
        }
      }
      

      if (keyDownEvent.key === '+') {
        if (gameState.mode == "start" && gameState.pairs < MAX_PAIRS) {
          gameState.pairs++;
          regenerateCardsRequired = true; 
          startAnimationRequired = true;
        }
      }

      if (keyDownEvent.key === '-') {
        if (gameState.mode == "start" && gameState.pairs > MIN_PAIRS) {
          gameState.pairs--;
          regenerateCardsRequired = true;
          startAnimationRequired = true;
        }
      }

      if (keyDownEvent.key === 'x') { // reveals the faces of all cards (cheat mode on)
        if (gameState.mode === "play") {
          cheatModeOn = true;
          for (const card of gameState.cards) {
            card.faceUp = true;
          }
        }
      }

      break;


    case "keyup":
      const keyUpEvent = e as KeyboardEvent;
      if (keyUpEvent.key === "x") { // hides the faces of all (unmatched) cards (cheat mode off)
        if (gameState.mode === "play") {
          cheatModeOn = false;
          for (const card of gameState.cards) {
            if (!card.matched && !gameState.selectedCards.includes(card)) {
              card.faceUp = false;
            }
          }
        }
      }
      break;

  }
});





// Set the face direction of all cards
// (true: face up, false: face down)
function setAllCardsFaceDirection(direction: boolean) {
  for (const card of gameState.cards) {
    card.faceUp = direction;
  }
}





// If gards are already generated, update the card locations;
// If not, create new cards based on the selected patterns.
function refreshCards(width: number, height: number) {
  const cardsPerRow = Math.min(Math.floor(width / 90), gameState.pairs * 2);
  const rowNum = Math.ceil(2 * gameState.pairs / cardsPerRow);

  const startX = 5 + (width - (cardsPerRow * 90)) / 2;
  const startY = height / 3;

  let currCardIndex = 1;
  
  for (let i = 0; i < rowNum; i++) {
    let currStartX = startX;
    let currStartY = startY + i * 90;

    let currRowCards = cardsPerRow;

    // Last row
    if (i == rowNum - 1 && i != 0) {
      currRowCards = (gameState.pairs * 2) - cardsPerRow * i;
      currStartX = 5 + (width - (currRowCards * 90)) / 2;
    }

    for (let j = 0; j < currRowCards; j++) {
      const x = currStartX + j * 90 + 40;
      const y = currStartY + 40;
      

      if (gameState.cards.length == gameState.pairs * 2) { // indicate that gameState.cards has been filled, need to update the card locations

        gameState.cards[currCardIndex - 1].x = x;
        gameState.cards[currCardIndex - 1].y = y;
      } else {
        const pattern = new selectedPatterns[Math.floor((currCardIndex - 1)/2)]();

        const card = new Card(x, y, pattern);
        if (gameState.cards.length < gameState.pairs * 2) {
          gameState.cards.push(card);
        }
      }

      currCardIndex++;
    }
  }
}



// Draw the background
function drawBackground(gc: CanvasRenderingContext2D) {
  gc.fillStyle = 'darkgrey';
  gc.fillRect(0, 0, gc.canvas.width, gc.canvas.height);
}


// Draw the given message
function drawMessage(gc: CanvasRenderingContext2D, text: string) {
  gc.fillStyle = 'white';
  gc.font = '24px sans-serif';
  const textMetrics = gc.measureText(text);
  const x = (gc.canvas.width - textMetrics.width) / 2;
  const y = gc.canvas.height / 4;
  gc.fillText(text, x, y);
}

// Draw the start message
function drawStartMessage(gc: CanvasRenderingContext2D) {
  drawMessage(gc, `${gameState.pairs} ${gameState.pairs > 1 ? 'pairs' : 'pair'}: Press SPACE to play`);
}

// Draw the win message
function drawWinMessage(gc: CanvasRenderingContext2D) {
  drawMessage(gc, "you finished! press SPACE to continue");
}



// Returns an array that shuffles patterns
function shufflePatterns() {
  let result: (typeof Pattern)[] = [];
  let array = [...patterns]; // create a copy of the array

  for (let j = 0; j < 15; j++) {
      const randomIndex = Math.floor(Math.random() * array.length);
      result.push(array[randomIndex]);
      array.splice(randomIndex, 1); // remove the selected class from the array
  }

  return result;
}


// Animate the object from (startX, startY) to (endX, endY) in duration ms
function animateObject(object: { x: number, y: number }, startX: number, startY: number, endX: number, endY: number, duration: number) {
  animationManager.add(new Animator(startX, endX, duration, (p) => { object.x = p; }, easeIn));
  animationManager.add(new Animator(startY, endY, duration, (p) => { object.y = p; }, easeIn));
}


// Animate the card rotation for 360 degrees in duration ms
function animateCardRotation(object: {rotation: number}, duration: number = 500) {
  animationManager.add(new Animator(0, 360, duration, (p) => { object.rotation = p; }, easeIn));
}



// Add juggle animations to all the cards in gameState.cards
function addJuggleAnimations() {
  for (let i = 0; i < gameState.cards.length; i++) {
    const originalY = gameState.cards[i].y;
    const shift = 2/3 * Math.PI * i; // adjust the smoothness of the wave effect

    const cardAnimator = new Animator(
      0, 1, 700,
      (t) =>
      { gameState.cards[i].y = originalY + Math.sin(4 * Math.PI * t + shift) * 10; }, // Apply phase shift 
      undefined,
      () => {cardAnimator.start(skTime);}, // restart the animation at the end
      true // loop forever
      );

    animationManager.add(cardAnimator);
  }
}


// End all looping animations
function endLoopAnimations() {
  animationManager.terminateLoopingAnimations();
}



function peek(x : number, y : number) {
  for (let i = 0; i < gameState.cards.length; i++) {
    if (
      insideHitTestRectangle(x, y, gameState.cards[i].x - 40, gameState.cards[i].y - 40, 80, 80) &&
      !gameState.cards[i].matched &&
      !gameState.selectedCards.includes(gameState.cards[i])
    ) {
      gameState.cards[i].faceUp = true;

      // Create a 500ms timer and start it
      const timer = new CallbackTimer(500, () => {
        if (gameState.mode === "play" && !cheatModeOn && !gameState.cards[i].matched && !gameState.selectedCards.includes(gameState.cards[i])) {
          gameState.cards[i].faceUp = false;
        }
        // Remove timer from timers array when it's done
        timers = timers.filter(t => t !== timer);
      });
      timer.start(skTime);
      timers.push(timer);

      return;
    }
  }
}