import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

function SaveScoreForm({setPlayerName, saveScore}) {
  const [name, setName] = useState(0)
  const handleSubmit = (e)=>{
    e.preventDefault();
    localStorage.setItem("playerName", name);
    setPlayerName(name);
    saveScore(name);
  }

  return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Control placeholder="Name" onChange={(e)=>setName(e.target.value)} required></Form.Control>
                    <Form.Text className="text-muted">
                        Please enter you name to save your score
                    </Form.Text>
                </Form.Group>
                <Button variant="secondary" style={{float: "right"}} type="submit">Save</Button>
            </Form>
        </div>
    )
}

export default SaveScoreForm