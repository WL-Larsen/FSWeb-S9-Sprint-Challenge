import axios from 'axios'
import e from 'cors'
import { response } from 'express'
import React, { useState } from 'react'


// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu index

export default function AppFunctional(props) {
  const [index, setIndex] = useState(initialIndex)
  const[message, setMessage] = useState(initialMessage)
  const[email, setEmail] = useState(initialEmail)
  const[steps, setSteps] = useState(initialSteps)


  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    const coordinates = [
    "1, 1", "2, 1", "3, 1",
    "1, 2", "2, 2", "3, 2",
    "1, 3", "2, 3", "3, 3"];

    return coordinates[index];
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    return ` Koordinantlar ${getXY(index)} `
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setIndex(initialIndex);
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps) ;   
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    setIndex(yon)
    setSteps(steps + 1);
    setMessage(initialMessage)
  }

  function ilerle(e) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
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
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(e.target.value)
  }

  function onSubmit(e) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    e.preventDefault()
    
    axios
    .post("http://localhost:9000/api/result",{ 
      x: getXY(), 
      y: getXY(), 
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
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? '*_*' : null}
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
