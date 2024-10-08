import './App.css';
import React from 'react';
import { db } from './firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function App() {
  const [test, setTest] = useState();
  const [inputdata, setInputdata] = useState();
  async function getTest() {
    const docRef = doc(db,"item","1");
    try{
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTest(docSnap.data());
      } else {
        console.error("No such Document");
      }
    } catch (error) {
      console.error("Error getting doc",error);
    }
  }

  async function userAdd(data) {
    const userRef = doc(db,"item");
    try {
      const addUser = await setDoc(userRef,data);
    } catch (error) {
      
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
  const insBtnClick =(e) =>{
    e.preventDefault();
    userAdd({
      uid:inputdata,
      upass:inputdata});
  }
  //최초 마운트 시 getTest import
  useEffect(() => {
    console.log(db);
    try {
      getTest()
    } catch (error) {
      console.log(error);
    }
    
  }, [])

  return (
    <div className='container'>
      <div className='app'>
        <div className='header'>
          <span>
            <h1>quiz test</h1>
          </span>
          test header
          <div>
          <form onSubmit={insBtnClick}>
            <input
              type="text"
              value={inputdata}
              onChange={(e)=>setInputdata(e.target.value)}
            />
            <button type="submit">insDb</button>
          </form>
          </div>
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
