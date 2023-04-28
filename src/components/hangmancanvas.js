import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

function HangManCanvas({ step, clear }) {

    const canvasRef = useRef(null)
    const draw = (context, step, canvas) => {
        context.strokeStyle = '#444';
        switch(step) {
            case 0:
                // clear canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                break;
            case 1:
                // draw piller
                context.lineWidth = 15; 
                context.beginPath();
                context.moveTo(100, 75);
                context.lineTo(100, 400);
                context.stroke();
                break;
            case 2:
                // draw beam
                context.lineWidth = 15; 
                context.beginPath();
                context.moveTo(50, 75);
                context.lineTo(450, 75);
                context.stroke();
                break;
            case 3:
                // draw scope
                context.lineWidth = 5; 
                context.beginPath();
                context.moveTo(250, 75);
                context.lineTo(250, 100);
                context.stroke();
                break;
            case 4:
                // draw head
                context.lineWidth = 5; 
                context.beginPath();
                context.arc(250, 125, 25, 0, Math.PI*2, true);
                context.stroke();
                break;
            case 5:
                // body
                context.lineWidth = 5; 
                context.beginPath();
                context.moveTo(250, 150);
                context.lineTo(250, 250)
                context.stroke();
                break;                               
            case 6:                                   
                context.lineWidth = 5;               
                context.beginPath();
                // left hand
                context.moveTo(250, 170);
                context.lineTo(200, 195);
                // right hand
                context.moveTo(250, 170);
                context.lineTo(300, 195);
                context.stroke();
                break;
            case 7:
                context.lineWidth = 5;
                context.beginPath();
                // left leg
                context.moveTo(250, 248);
                context.lineTo(220, 300);
            
                // right leg
                context.moveTo(250, 248);
                context.lineTo(280, 300);
                context.stroke();
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        draw(context, step, canvas)
      }, [step])

    return <canvas width="500" height="500" ref={canvasRef}/>
}

export default HangManCanvas