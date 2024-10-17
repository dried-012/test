import './App.css';
import React from 'react';
import { db } from './firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';

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

  const userjoin = async(email, password)=>{
    try{
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const { stsTokenManager, uid } = user;
      setAuthInfo({ uid, email, authToken: stsTokenManager });
      //navigate('/');
    }catch({ code, message }){
      alert(errorMessage[code]);
    }
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
          <form onSubmit={userjoin}>
            <div>
              <input
                type="email"
                id="email"
              />
            </div>
              <div><input
                type="password"
                id="password"
              />
              </div>
              <button type="submit">dbins</button>
          </form>
          </div>
        </div>

        <div className='content'>
          <p><span> </span></p>{/*몇번 문제 출력*/}
          <h1> </h1> {/*문제 내용 출력*/}
          <div> {/*db 불러옴*/}
            {test !== undefined &&
            <div>{test.uid}</div>}
            

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
