import './App.css';
import React from 'react';
import { db } from './firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [test, setTest] = useState();
  async function getTest() {
    const docRef = doc(db,"item","1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTest(docSnap.data())
    }
  }
  const handleClick = (e) => {
    //console.log(e.target);
    //console.log(e.target.value);
    const answer = e.target.value;
    if(answer == "4학년"){
      alert("");
    }else{
      alert("");
    }
  };

  //최초 마운트 시 getTest import
  useEffect(() => {
    getTest()
  }, [])

  return (
    <div className='container'>
      <div className='app'>
      <div className='black-nav'>
        <div>Quiz test Text</div>
      </div>
      <div className='question-selection'>
        <h1 className='question-header'>
          <span>1</span>/4
        </h1>
          <div className='question-text'>
            test Text Question
          </div>
      </div>
      <div className="question-section">
        <button onClick={handleClick} value="1학년">1학년</button>
        <button onClick={handleClick} value="2학년">2학년</button>
        <button onClick={handleClick} value="3학년">3학년</button>
        <button onClick={handleClick} value="4학년">4학년</button>
      </div>
      </div>

      {<div>
        {test !== undefined &&
        <div>{test.name}</div>}
      </div>}
    </div>
  );
}
//fnm env --use-on-cd | Out-String | Invoke-Expression
//fnm use --install-if-missing 20

export default App;
