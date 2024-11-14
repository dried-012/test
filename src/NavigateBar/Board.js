import React from "react";
import '../css/Board.css';
import { db,_apiKey } from '../firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp, addDoc } from 'firebase/firestore';
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

function Board(){
  const navigate = useNavigate();
  const [boardData,setBoardData] = useState([]);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const auth = getAuth();
  const [uData, setuData] = useState();
  const [inputid, setInputid] = useState();
  const [inputpwd, setInputpwd] = useState();
  const [isSignin, setisSignin] = useState(false);
  const [isLogined,setisLogined] = useState(false);
  const [title,setTitle] = useState('');
  const [subject,setSubject] = useState('');
  const [file,setFile] = useState(null);

    async function getBoard() {
        const dataArray = [];
        const collRef = collection(db,"board");
        const getDbContent = await getDocs(collRef);
        getDbContent.forEach((doc) => {
          const docData = doc.data();
          if(docData.date && docData.date instanceof Timestamp){
            docData.date = docData.date.toDate();
          }
          dataArray.push(docData);
        });
      setBoardData(dataArray);
    }

    const pageUp = (e) => {
      e.preventDefault();
      switch(e.target.value){
        case "mypage":
          navigate('/mypage');
        break;
        case "mytest":
          navigate('/mytest');
        break;
        case "board":
          navigate('/board');
        break;
        case "about":
          navigate('/about');
        break;
      }
    }

    function PageRs() {
      navigate('/');
    }

    const userjoin = async (e) =>{
      e.preventDefault();
      if(document.getElementById("checkPass").value == password){
        try{
          const { user } = await createUserWithEmailAndPassword(auth, email, password);
          const { stsTokenManager,uid } = user;
          handleClick();
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
  
    async function getBoard() {
      const dataArray = [];
      const collRef = collection(db,"board");
      try {
        const getDbContent = await getDocs(collRef);
        getDbContent.forEach((doc) => {
          const docData = doc.data();
          if(docData.date && docData.date instanceof Timestamp){
            docData.date = docData.date.toDate();
          }
          dataArray.push(docData); 
        });
        setBoardData(dataArray);
      } catch (error) {
        console.log(error);
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
        setPersistence(auth,browserSessionPersistence).then(()=>{
          signInWithEmailAndPassword(auth,email, password).then((result)=>{
            setisLogined(true);
            console.log(result);
            const user = result.user;
            setuData({
              uid:user.uid,
              email:user.email
            });
            navigate('/');
          });
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  
    const logout = async (e) =>{
      try {
        const auth = getAuth();
        signOut(auth).then(()=>{
          window.location.replace("/");
          setisLogined(false);
        }).catch((error)=>{
          console.log(error.message);
        });
      } catch {
  
      }
    };


    const insBtnClick = async(e) =>{
      e.preventDefault();
      if(!title || !subject) {
        alert('제목과 본문을 모두 입력해 주세요.');
        return;
      }
      const dateRef = new Date().getTime();
      try{
        const docRef = await addDoc(collection(db,"board"),{
          title:title,
          subject:subject,
          file: file ? file.name : null,
          date:Timestamp.now(),
          author:uData.email
        });
        console.log("문서추가 완료, 문서 id:"+ docRef.id);
        alert("게시글 등록완료");
        setTitle('');
        setSubject('');
        setFile(null);
      }catch(error){
        console.error('Firestore에 데이터 삽입 실패:', e);
        console.log(error.message)
        alert('게시글 등록에 실패했습니다.');
      }
    }

    const handleClick = (e) => {
      if(!isSignin)
        setisSignin(true);
      else
        setisSignin(false);
    };
    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }
    useEffect(() => {
        try {
            getBoard();
            const unsubcribe = onAuthStateChanged(auth,(user)=>{
              if(user){
                setisLogined(true);
                setuData({
                  uid:user.uid,
                  email:user.email
                });
              }else{
                setisLogined(false);
              }
            });
            return unsubcribe;
        } catch (error) {
          console.log(error);
        }
    },[]);

    return(
        <div>
            <span>
              <h1 onClick={PageRs}>quiz test</h1>
            </span>
          <div id="header">
            <div id="navigateDiv">
              <ul className="navigateBar">
                <li><button onClick={pageUp} value='board'>게시판</button></li>
                <li><button onClick={pageUp} value='mytest'>문제풀기</button></li>
                <li><button onClick={pageUp} value="about">About</button></li>
                <li><button onClick={pageUp} value='mypage'>마이페이지</button></li>
              </ul>
            </div>
          </div>
          <div id="loginDiv">
          {uData == undefined && !isSignin && !isLogined &&
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
          || isLogined &&
          <div className='dataDiv'>
            {uData.email}
            <div className='dataDiv'>
              <button onClick={logout}>logout</button>
            </div>
          </div>
          || !isLogined &&
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
              <button type="submit">회원가입</button>
              <button onClick={handleClick}>돌아가기</button>
          </form>
        }
          </div>
        <div className='boardDiv'>
            <div className='boardTopDiv'>
              <div id='boardHead'><h2>게시판</h2></div>
              <ul>
                <li>
                  <div className='boardNo'>NO</div>
                  <div className='boardTitle'>제목</div>
                  <div className='boardAuthor'>작성자</div>
                  <div className='boardDate'>작성일</div>
                </li>
              </ul>
            </div>
            <div className='boardBodyDiv'>
              <ul>
                {boardData.length > 0 &&
                 boardData.map((item, idx)=>(
                  <li key={idx}>
                    <div className='boardNo'>{idx+1}</div>
                    <div className='boardTitle'>{item.title}</div>
                    <div className='boardAuthor'>{item.author.split('@')[0]}</div>
                    <div className='boardDate'>{item.date.toLocaleDateString()}</div>
                  </li>  
                ))}
              </ul>
            </div>
          </div>
          <div className='boardConDiv'>
            <button>글쓰기</button>
            <div className='boardWrDiv'>
              <form onSubmit={insBtnClick}>
                <span>제목</span>
                <div className='titleDiv'><input
                 type="text"
                 id="title"
                 value={title}
                 onChange={(e)=>setTitle(e.target.value)}
                /></div>
                <span>본문</span>
                <div className='subjectDiv'>
                  <textarea 
                  id="subject"
                  value={subject}
                  onChange={(e)=>setSubject(e.target.value)}/>
                </div>
                <span>파일첨부</span>
                <div><input
                 type="file"
                 id="file"
                 value={file}
                 onChange={handleFileChange}
                /></div>
                <div><button type='submit'>글입력</button></div>
              </form>
            </div>
          </div>
        </div>
    );
}

export default Board;