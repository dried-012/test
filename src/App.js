import './App.css';
import React from 'react';
import { db } from './firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

function App() {
  const [test, setTest] = useState();
  const [inputid, setInputid] = useState();
  const [inputpwd, setInputpwd] = useState();
  async function getTest() {
    const docRef = doc(db,"item","userid");
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

  async function buttonTest() {
    var webUid = document.test.uid.value;
    var webUpass = document.test.upass.value;
    alert(webUid + ", " + webUpass);
  }

  async function userAdd(data) {
    var userRef = null;
    var userNumber = null;
    const docRef = doc(db,"countDB","counter");
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists){
        userNumber = docSnap.data().userNum;
        userRef = doc(db,"item",(userNumber).toString());
        userNumber++;
        await updateDoc(docRef,{
          userNum:userNumber
        })}
      await setDoc(userRef,data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleClick = (e) => {
    
  };
  const insBtnClick = (e) =>{
    e.preventDefault();
    console.log("clickBtn");
      userAdd({
        uid:inputid,
        upass:inputpwd});
    
    
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
              value={inputid}
              onChange={(e)=>setInputid(e.target.value)}
            />
            <input
              type="password"
              value={inputpwd}
              onChange={(e)=>setInputpwd(e.target.value)}
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
            <div>{test.uid}</div>}
            <form name="test">
              <div>아이디: <input type="text" name="uid"></input></div>
              <div>비밀번호: <input type="password" name="upass"></input></div>
              <button onClick={buttonTest}>버튼클릭 이벤트 테스트 (onClick)</button>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
