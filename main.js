// Letters
const letters = "abcdefghijklmnopqrstuvwxyz";
// Get Array From Letters
let lettersArray = Array.from(letters);
// Get The Letters Container
let lettersContainer = document.querySelector(".letters");
// Generate Letters
lettersArray.forEach((letter) => {
  let span = document.createElement("span");
  let theLetter = document.createTextNode(letter);
  // Add The Letter To Span
  span.appendChild(theLetter);
  // Add Class To The Letter
  span.className = "letter-box";
  // Add Span To Letters Container
  lettersContainer.appendChild(span);
});

fetch("words.json")
  .then((response) => response.json())
  .then((words) => startGame(words))
  .catch((error) => console.error("Error loading words:", error));

function startGame(words) {
  // Get The Object Keys
  let allKeys = Object.keys(words);
  // Get The Random Number From All Keys
  let randomKeyNumber = Math.floor(Math.random() * allKeys.length);
  // Get Category Depend On Random Number Of Key
  let randomKeyName = allKeys[randomKeyNumber]; // Category

  // Get The Words Of Random Category
  let randomWords = words[randomKeyName];
  // Get The Random Numbers From Random Words Of Category
  let randomWordNumber = Math.floor(Math.random() * randomWords.length);
  // Get The Word Name From Random Number
  let randomWordName = randomWords[randomWordNumber]; // Word
  // Set Category Info
  document.querySelector(".game-category span").innerHTML = randomKeyName;

  // Select The Letters Guess Container
  const lettersGuessContainer = document.querySelector(".letters-guess");
  // Convert The Random Word To Array
  let lettersAndSpace = Array.from(randomWordName);
  // Create Spans Depend On Number Of Letters
  lettersAndSpace.forEach((letter) => {
    // Create Span
    let span = document.createElement("span");
    // Check If The Letter Is Space
    if (letter === " ") {
      span.className = "has-space";
    }
    // Append Span To letters Guess Container
    lettersGuessContainer.appendChild(span);
  });

  // Select Guess Spans
  let guessSpans = document.querySelectorAll(".letters-guess span");

  // Get The Draw
  let theDraw = document.querySelector(".hungman-draw");

  // Set Number Of Wrong Attempts
  let wrongAttempts = 0;
  let correctGuesses = 0; // Track correct guesses

  console.log(lettersAndSpace);
  // Handle Clicking On Letters
  document.addEventListener("click", (e) => {
    // Set The Chosen Status
    let theStatus = false;
    if (e.target.className === "letter-box") {
      e.target.classList.add("clicked");
      // Get The Clicked Letter
      let theClickedLetter = e.target.innerHTML.toLowerCase();

      // Loop On The Letters Of Word
      lettersAndSpace.forEach((letter, letterIndex) => {
        // Check If The Clicked Letter Is Found In Word
        if (theClickedLetter.toLowerCase() === letter.toLowerCase()) {
          theStatus = true;
          guessSpans.forEach((span, spanIndex) => {
            if (spanIndex === letterIndex) {
              span.innerHTML = letter;
              correctGuesses++; // Increment correct guesses
            }
          });
        }
      });

      // Check if player won
      if (correctGuesses === lettersAndSpace.filter((l) => l !== " ").length) {
        endGame(true); // Call endGame with true to show winning message
      }

      // If the letter is incorrect
      if (!theStatus) {
        wrongAttempts++;
        theDraw.classList.add(`wrong-${wrongAttempts}`);
        if (wrongAttempts === 8) endGame(false); // Call endGame with false for losing message
      }
    }
  });

  function endGame(isWin) {
    lettersContainer.classList.add("finished");

    // Create Popup
    let popupDiv = document.createElement("div");
    popupDiv.className = "popup";
    // Add Winning or Losing Message
    if (isWin) {
      popupDiv.appendChild(
        document.createTextNode("Congratulations! You've guessed the word ")
      );
    } else {
      popupDiv.appendChild(document.createTextNode("Game Over, The Word is "));
    }

    // Create Element To Hold The Right Word
    let wordSpan = document.createElement("span");
    wordSpan.appendChild(document.createTextNode(randomWordName.toUpperCase()));
    popupDiv.appendChild(wordSpan);

    // Create Restart Button
    let restartBtn = document.createElement("button");
    
    restartBtn.className = "restart";
    restartBtn.appendChild(document.createTextNode("Restart!"));
    popupDiv.appendChild(restartBtn);

    // Add The Popup Div To Body
    document.body.appendChild(popupDiv);

    // Handle Restart Button Click
    restartBtn.addEventListener("click", () => {
      window.location.reload(); // Reload the page to start a new game
    });
  }
}
