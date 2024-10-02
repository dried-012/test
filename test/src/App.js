import './App.css';
import React from 'react';
import { db } from './firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  console.error("app start");
  const [test, setTest] = useState();
  console.error("db connect");
  async function getTest() {
    console.error("getTest()");
    const docRef = doc(db,"item","1");
    console.error("1");
    try{
      console.error("1.5");
      const docSnap = await getDoc(docRef);
      console.error("2");
      if (docSnap.exists()) {
        setTest(docSnap.data());
        console.error("Yes such Document");
      } else {
        console.error("No such Document");
      }
    } catch (error) {
      console.error("Error getting doc",error);
      console.error("Error getting doc",error);
      console.error("Error details:", error.message);
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
