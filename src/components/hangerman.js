
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal"
import Alert from "react-bootstrap/Alert"
import Button from "react-bootstrap/Button"
import LeaderBoard from "./leaderboard";
import SaveScoreForm from "./savescoreform";
import HangManCanvas from "./hangmancanvas";
import "../HangerMan.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, onValue, set, push } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB20_H4K9kWZMd3vH1xSp4GaWA2WSQOE0Y",
  authDomain: "test-project2-dffb4.firebaseapp.com",
  databaseURL: "https://hangman-7985d-default-rtdb.firebaseio.com/",
  projectId: "test-project2-dffb4",
  storageBucket: "test-project2-dffb4.appspot.com",
  messagingSenderId: "960634107139",
  appId: "1:960634107139:web:15f92b170133c4862ce536",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
    const [showSaveScoreForm, setShowSaveScoreForm] = useState(false);
    const [showLeaderBoard, setShowLeaderBoard] = useState(false);
    const [playerName, setPlayerName] = useState('')
    const [scoreData, setScoreData] = useState([])
    const maxNumGuesses = 7; // to match hangman draw
    const passphrase = "1234567890";
  
    useEffect(() => { //get words from file
      fetch("/words.txt")
        .then((response) => response.text())
        .then((data) => {
          setWords(data.split("\n")); // change \r\n to \n to prevent problem in windows machine. \r will be remove in the end of generateWord function
        })
        .catch((error) => console.log(error));
    }, []);
  
    // Generate a random word from the words array
    const generateWord = () => {
      const randomIndex = Math.floor(Math.random() * words.length);
      // console.log(words[randomIndex]);
      return words[randomIndex].replaceAll('\r', '').replaceAll(' ',''); // remove \r words.txt is on windows machine
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
    // console.log(newWord) // uncomment for debugging
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
    // disable when model shows up
    if (showSaveScoreForm) {
      return
    }
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

  const loadScoreData = ()=>{
    const db = getDatabase();
    const dbRef = ref(db, "/user");
    onValue(dbRef, (snapshot) => {
      const data = []
      snapshot.forEach((user)=>{
        data.push({ key: user.key, name: user.val().name, score: user.val().score})
      })
      data.sort((a, b)=>{
        return b.score - a.score
      })
      setScoreData(data)
    })
  }


  //Add event listener for keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  //Initialize the game state
  useEffect(() => {
    if (words.length > 0) { //ensure words is populated
      resetGame();
      loadScoreData();
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

  const closeSaveScoreForm = ()=>{
    setShowSaveScoreForm(false)
  }

  const saveScore = (name) =>{
    setShowSaveScoreForm(false)
    console.log(`Save user score: ${name} ${score}`)
    const db = getDatabase();
    var dbRef = "";

    // prevent user save multiple record
    // if(localStorage.getItem("playerKey") !== null) {
    //   dbRef = ref(db, "users/" + localStorage.getItem("playerKey"))
    // }
    // else {
    //   dbRef = push(ref(db, "users/"))
    // }
    dbRef = push(ref(db, "user/"))
    console.log(`Save user score: ${name} ${score} ${dbRef}`)
    set(dbRef, {
      name: name,
      score: score
    }).then(()=>{
      // a unique key will generate and save in local storage
      // to help highlight the user score in leaderboard.
      localStorage.setItem("playerKey", dbRef.key)
      alert("Score save successfully")
    }).catch(()=>{
      alert("Fail to save score, please try again.")
    })
  }

  return (
    <div className="container">
      <Button variant="link" onClick={(e)=>{e.preventDefault(); setShowLeaderBoard(true)}}>Leaderboard</Button>
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
      </p>
      
      {isGameWon && (
        <div style={{textAlign: "center"}}>
          <Alert variant="success">
            <h2>Congratulations! You won!</h2>
            <h3>Your score was {score}</h3>
            <button onClick={resetGame}>Play Again</button>
            <button onClick={()=>setShowSaveScoreForm(true)}>Save Score</button>
          </Alert>
        </div>
      )}

      {isGameLost && (
        <div style={{textAlign: "center", margin: "10px"}}>
          <Alert variant="secondary">
            <h2>Sorry you lost! Please try again! </h2>
            <h3>The word was {word}</h3>
            <button onClick={resetGame}>Play Again</button>
          </Alert>
        </div>
      )}

      <Modal show={showSaveScoreForm} onHide={closeSaveScoreForm} style={{ padding: 10 }}>
        <Modal.Header closeButton>
        <h3>Your score was {score}</h3>
        </Modal.Header>
        <Modal.Body>
          <SaveScoreForm setPlayerName={setPlayerName} saveScore={saveScore}></SaveScoreForm>
        </Modal.Body>
      </Modal>

      <Modal show={showLeaderBoard} onHide={setShowLeaderBoard} style={{ padding: "10" }}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <LeaderBoard data={scoreData} playerName={playerName}></LeaderBoard>
        </Modal.Body>
      </Modal>

      <button id="formButton" onClick={goToForm}>
        Create custom game
      </button>

      <HangManCanvas step={wrongLetters.length}></HangManCanvas>
    </div>
  );
}

export default HangerMan;
