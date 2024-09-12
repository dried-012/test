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
        <div className='header'>
          <span>
            <h1>quiz test</h1>
          </span>
        </div>
        <div className='content'>
          <p><span> </span></p>{/*몇번 문제 출력*/}
          <h1> </h1> {/*문제 내용 출력*/}
          <div> {/*db 불러옴*/}
            {test !== undefined &&
            <div>{test.name}</div>}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
