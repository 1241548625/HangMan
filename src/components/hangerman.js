
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../HangerMan.css";

const words = ["apple", "banana", "orange", "mango", "grape"];

function HangerMan() {
  const params = useParams();
  const [word, setWord] = useState("");
  const [maskedWord, setMaskedWord] = useState("");
  const [letters, setLetters] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const maxNumGuesses = 6;
  const passphrase = "1234567890";

  const generateWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const maskWord = (word) => {
    let maskedWord = "";
    for (let i = 0; i < word.length; i++) {
      maskedWord += "_";
    }
    return maskedWord;
  };

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

  const checkWin = (maskedWord) => {
    return maskedWord === word;
  };

  const checkLoss = (wrongLetters) => {
    return wrongLetters.length === maxNumGuesses;
  };

  const resetGame = () => {
    var newWord = "";

    if (params.word != null) {
      const CryptoJS = require("crypto-js");
      const bytes = CryptoJS.AES.decrypt(params.word, passphrase);
      const original = bytes.toString(CryptoJS.enc.Utf8);
      newWord = original;
    } else {
      newWord = generateWord();
    }

    setWord(newWord);
    setMaskedWord(maskWord(newWord));
    setLetters(newWord.split(""));

    setUsedLetters([]);
    setWrongLetters([]);
    setIsGameWon(false);
    setIsGameLost(false);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key.toLowerCase();

      if (letters.includes(letter)) {
        if (!usedLetters.includes(letter)) {
          const newMaskedWord = revealLetter(letter);
          setMaskedWord(newMaskedWord);

          setUsedLetters([...usedLetters, letter]);

          if (checkWin(newMaskedWord)) {
            setIsGameWon(true);
          }
        }
      } else {
        if (!usedLetters.includes(letter)) {
          setWrongLetters([...wrongLetters, letter]);

          setUsedLetters([...usedLetters, letter]);

          if (checkLoss([...wrongLetters, letter])) {
            setIsGameLost(true);
          }
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    resetGame();
  }, []);

  var remainingGuesses = maxNumGuesses - wrongLetters.length;
  var score = word.length + (word.length - wrongLetters.length);
  var tense = "have";
  if (isGameWon) {
    tense = "had";
  }

  const navigate = useNavigate();

  const goToForm = (event) => {
    navigate("/form");
  };

  return (
    <div className="container">
      <h1>Hangman</h1>
      <p>Find the hidden word - Enter a letter</p>
      <p>{maskedWord}</p>
      <p>
        {wrongLetters.length > 0 && "Wrong letters: "}
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter.toUpperCase()}</span>
        ))}
        <div>
          You {tense} {remainingGuesses} guesses remaining.
        </div>
      </p>
      {isGameWon && (
        <div>
          <h2>Congratulations! You won!</h2>
          <h3>Your score was {score}</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      {isGameLost && (
        <div>
          <h2>Sorry you lost! Please try again! </h2>
          <h3>The word was {word}</h3>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
      <button id="formButton" onClick={goToForm}>
        Create custom game
      </button>
    </div>
  );
}

export default HangerMan;
