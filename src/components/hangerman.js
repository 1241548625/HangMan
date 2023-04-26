import React, { useState, useEffect } from "react";

const words = ["apple", "banana", "orange", "mango", "grape"];

function HangerMan() {
  const [word, setWord] = useState("");
  const [maskedWord, setMaskedWord] = useState("");
  const [letters, setLetters] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);

  // Generate a random word from the words array
  const generateWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  // Create a masked word with underscores
  const maskWord = (word) => {
    let maskedWord = "";
    for (let i = 0; i < word.length; i++) {
      maskedWord += "_";
    }
    return maskedWord;
  };

  // Reveal the letter in the masked word
  const revealLetter = (letter) => {
    let newMaskedWord = "";
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        newMaskedWord += letter;
      } else {
        newMaskedWord += maskedWord[i];
      }
    }
    return newMaskedWord;
  };

  // Check if the game is won
  const checkWin = (maskedWord) => {
    return maskedWord === word;
  };

  // Check if the game is lost
  const checkLoss = (wrongLetters) => {
    return wrongLetters.length === 6;
  };

  // Reset the game state
  const resetGame = () => {
    const newWord = generateWord();
    setWord(newWord);
    setMaskedWord(maskWord(newWord));
    setLetters(newWord.split(""));
    setUsedLetters([]);
    setWrongLetters([]);
    setIsGameWon(false);
    setIsGameLost(false);
  };

  // Handle the keyboard input
  const handleKeyDown = (e) => {
    // Check if the pressed key is a letter
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();

      // Check if the letter is in the word
      if (letters.includes(letter)) {
        // Check if the letter has not been already guessed
        if (!usedLetters.includes(letter)) {
          // Reveal the letter in the masked word
          const newMaskedWord = revealLetter(letter);
          setMaskedWord(newMaskedWord);

          // Add the letter to the used letters array
          setUsedLetters([...usedLetters, letter]);

          // Check if the game is won
          if (checkWin(newMaskedWord)) {
            setIsGameWon(true);
          }
        }
      } else {
        // Check if the letter has not been already guessed
        if (!usedLetters.includes(letter)) {
          // Add the letter to the wrong letters array
          setWrongLetters([...wrongLetters, letter]);

          // Add the letter to the used letters array
          setUsedLetters([...usedLetters, letter]);

          // Check if the game is lost
          if (checkLoss([...wrongLetters, letter])) {
            setIsGameLost(true);
          }
        }
      }
    }
  };

  // Add event listener for keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Initialize the game state
  useEffect(() => {
    resetGame();
  }, []);

  return (
        <div>
        <h1>Hangman</h1>
        <p>Find the hidden word - Enter a letter</p>
        <p className="masked-word">{maskedWord}</p>
        <p className="wrong-letters">
            {wrongLetters.length > 0 && "Wrong letters: "}
            {wrongLetters.map((letter, i) => (
            <span key={i}>{letter.toUpperCase()}</span>
            ))}
        </p>
        {isGameWon && <div className="popup-container" id="popup-container">
          <div className="popup">
            <h2>Congratulations! You won! 😃</h2>
            <button onClick={resetGame} id="play-button">Play Again</button>
          </div>
        </div>}

        {isGameLost && <div className="popup-container" id="popup-container">
          <div className="popup">
            <h2>Sorry you lost! Please try again! 😃</h2>
            <button onClick={resetGame} id="play-button">Play Again</button>
          </div>
        </div>}
        </div>
    )
}

export default HangerMan