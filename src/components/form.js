import React, { useState } from "react";
//import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function CustomGameForm() {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [url, setUrl] = useState("");

  const handleChange = (event) => {
    setWord(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //navigate("/${word}");
    setUrl(document.URL.replace("form","")+word.toLowerCase()); //TODO: word is visible in URL
  };
  
  return (
    <Container>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          padding: "50px",
          borderRadius: "5px",
          boxShadow: "3px 3px 9px 3px lightgrey",
          minWidth: "400px",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>
              <h1>Custom Hangman</h1>
            </Form.Label>
            <br></br>
            <Form.Control
              type="text"
              placeholder="Please Enter A Word"
              value={word}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" style={{ float: "right" }}>
            Submit
          </Button>
        </Form>
        <div>{url}</div>
      </div>
    </Container>
  );
}

export default CustomGameForm;
