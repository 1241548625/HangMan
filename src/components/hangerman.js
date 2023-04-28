
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../HangerMan.css";

//const words = ["apple", "banana", "orange", "mango", "grape"];

function HangerMan() {
    const [words, setWords] = useState([]);
    const [params, setParams] = useState(useParams());
    const [word, setWord] = useState("");
    const [maskedWord, setMaskedWord] = useState("");
    const [letters, setLetters] = useState([]);
    const [usedLetters, setUsedLetters] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [isGameWon, setIsGameWon] = useState(false);
    const [isGameLost, setIsGameLost] = useState(false);
    const maxNumGuesses = 6;
    const passphrase = "1234567890";
  
    useEffect(() => { //get words from file
      fetch("/words.txt")
        .then((response) => response.text())
        .then((data) => {
          setWords(data.split("\r\n"));
        })
        .catch((error) => console.log(error));
    }, []);
  
    // Generate a random word from the words array
    const generateWord = () => {
      const randomIndex = Math.floor(Math.random() * words.length);
      console.log(words[randomIndex]);
      return words[randomIndex].replaceAll(' ','');
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
    return wrongLetters.length === maxNumGuesses;
  };

  //Reset the game state
  const resetGame = () => {
    var newWord = "";
    document.getElementById("hmanGraphic").src = ("/hman-0.png"); //reset graphic

    if (params.word != null) {
      //decrypt params and set as word
      const CryptoJS = require("crypto-js");
      const bytes = CryptoJS.AES.decrypt(params.word.replaceAll('~','/'), passphrase);
      const original = bytes.toString(CryptoJS.enc.Utf8);
      newWord = original;
      setParams("");
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

  //Handle the keyboard input
  const handleKeyDown = (e) => {
    if (!isGameWon && !isGameLost){
      //Check if the pressed key is a letter
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key.toLowerCase();

        //Check if the letter is in the word
        if (letters.includes(letter)) {
          //Check if the letter has not been already guessed
          if (!usedLetters.includes(letter)) {
            //Check if the letter has not been already guessed
            const newMaskedWord = revealLetter(letter);
            setMaskedWord(newMaskedWord);

            //Add the letter to the used letters array
            setUsedLetters([...usedLetters, letter]);

            //Check if the game is won
            if (checkWin(newMaskedWord)) {
              setIsGameWon(true);
            }
          }
        } else {
          //Check if the letter has not been already guessed
          if (!usedLetters.includes(letter)) {
            //Add the letter to the wrong letters array
            setWrongLetters([...wrongLetters, letter]);
            document.getElementById("hmanGraphic").src = ("/hman-"+(wrongLetters.length+1)+".png"); //remove limbs with each incorrect guess

            //Add the letter to the used letters array
            setUsedLetters([...usedLetters, letter]);

            //Check if the game is lost
            if (checkLoss([...wrongLetters, letter])) {
              setIsGameLost(true);
            }
          }
        }
      }
  }
  };

  //Add event listener for keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  //Initialize the game state
  useEffect(() => {
    if (words.length > 0) { //ensure words is populated
      resetGame();
    }
  }, [words]);

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
      <h1 style={{ marginTop: "0.5rem" }}>Hangman</h1>
      <p>Find the hidden word - Enter a letter</p>
      <p>{maskedWord}</p>
      <p style = {{textAlign:"center"}}>
        {wrongLetters.length > 0 && "Wrong letters: "}
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter.toUpperCase()}</span>
        ))}
        <div>
          <img id= "hmanGraphic" src="/hman-0.png" width="50%"/>
        </div>
        <div>
          You {tense} {remainingGuesses} guesses remaining.
        </div>
      </p>
      <div>
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
    </div>
  );
}

export default HangerMan;
