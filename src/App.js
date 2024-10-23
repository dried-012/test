import './App.css';
import React from 'react';
import { db } from './firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut } from 'firebase/auth';

function App() {
  const [test, setTest] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const auth = getAuth();
  const [uData, setuData] = useState();
  const [inputid, setInputid] = useState();
  const [inputpwd, setInputpwd] = useState();
  const navigate = useNavigate();
  const [isSignin, setisSignin] = useState(false);

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

  const userjoin = async (e) =>{
    e.preventDefault();
    if(document.getElementById("checkPass").value == password){
      try{
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const { stsTokenManager,uid } = user;
        navigate('/');
      }catch(error){
        if(error.message!=="Firebase: Error (auth/email-already-in-use)."){
          alert(error.message);
        }
        alert("이미가입된 이메일입니다");
      }
    }else{
      alert("비밀번호가 다릅니다");
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

  const login = async (e) =>{
    e.preventDefault();
    try {
      signInWithEmailAndPassword(auth,email, password).then((result)=>{
        console.log(result);
        const user = result.user;
        setuData(user.uid);
        navigate('/');
      })
    } catch (error) {
      console.log(error.message);
    }
  }
  const logout = async (e) =>{
    try {
      const auth = getAuth();
      signOut(auth).then(()=>{
        window.location.replace("/");
      }).catch((error)=>{
        console.log(error.message);
      });
    } catch (error) {
      
    }
    
  };

  const handleClick = (e) => {
    if(!isSignin)
      setisSignin(true);
    else
      setisSignin(false);
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
      getTest();
      
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
          {uData == undefined && !isSignin &&
          <form onSubmit={login}>
            <div>
              <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
              placeholder="email@xxxxx.com"
            />
            </div>
            <div>
            <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                placeholder="비밀번호"
              />
            </div>
              <button type="submit">login</button>
              <button onClick={handleClick}>signup</button>
          </form>
          || uData!==undefined &&
          <div>
            loginChk
            <br></br>
            {uData}
            <br></br>
            <button onClick={logout}>logout</button>
          </div>
          ||
          <form onSubmit={userjoin}>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                placeholder="email@xxxxx.com"
              />
            </div>
              <div><input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                placeholder="비밀번호"
              />
              </div>
              <div><input
                type="password"
                id="checkPass"
                placeholder="비밀번호확인"
              />
              </div>
              <button type="submit">dbins</button>
              <button onClick={handleClick}>back</button>
          </form>
        }
          </div>
        </div>

        <div className='content'>
          <p><span> </span></p>{/*몇번 문제 출력*/}
          <h1> </h1> {/*문제 내용 출력*/}
          <div> {/*db 불러옴*/}
            {test !== undefined &&
            <div>{test.uid}</div>}
            
            <div>{uData}</div>

          </div>
        </div>
      </div>

    </div>
    
  );
}

export default App;
