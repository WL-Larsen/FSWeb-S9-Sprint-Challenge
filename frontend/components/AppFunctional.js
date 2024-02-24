import axios from 'axios'
import e from 'cors'
import { response } from 'express'
import React, { useState } from 'react'


const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 

export default function AppFunctional(props) {
  const [index, setIndex] = useState(initialIndex)
  const[message, setMessage] = useState(initialMessage)
  const[email, setEmail] = useState(initialEmail)
  const[steps, setSteps] = useState(initialSteps)


  

  function getXY() {
   
    const coordinates = [(index % 3) + 1, Math.floor(index / 3) + 1]

    return coordinates;

  }

  function getXYMesaj() {
   return ` Koordinantlar ${getXY()[0]} ${getXY()[1]} `
  }

  function reset() {
    setIndex(initialIndex);
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps) ;   
  }

  function sonrakiIndex(yon) {
    setIndex(yon)
    setSteps(steps + 1);
    setMessage(initialMessage)
  }

  function ilerle(e) {
    const tus = e.target.id;

    if(tus === 'left'){
      if(index % 3 === 0){
        setMessage("Sola gidemezsiniz.")
      }else{
        setIndex(index  - 1);
        sonrakiIndex(index -1)
       
      }}
      
    if(tus === 'up'){
      if(index < 3){
        setMessage("Yukarı gidemezsiniz.")
      }else{
        setIndex(index  - 3);
        sonrakiIndex(index - 3);
      }}

    if(tus === 'right'){
      if(index % 3 === 2){
        setMessage("Sağa gidemezsiniz.")
      }else{setIndex(index  + 1);
        sonrakiIndex(index + 1)
      
      }
      }

    if(tus === 'down'){
      if(index > 5){
        setMessage("Aşağı gidemezsiniz")
      }else{setIndex(index + 3);
        sonrakiIndex(index + 3)}
      }

  }

  function onChange(e) {
    setEmail(e.target.value)
  }

  function onSubmit(e) {
    e.preventDefault()

    axios
    .post("http://localhost:9000/api/result",{ 
      x: getXY()[0], 
      y: getXY()[1], 
      steps: steps, 
      email: email,
    })
    .then(function (response) {
      // handle success
      console.log(response);
      setMessage(response.data.message)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      setMessage(error.response.data.message)
    })

  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={ilerle} id="left">SOL</button>
        <button onClick={ilerle} id="up">YUKARI</button>
        <button onClick={ilerle} id="right">SAĞ</button>
        <button onClick={ilerle} id="down">AŞAĞI</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input value={email} id="email" type="email" placeholder="email girin" onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
