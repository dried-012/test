import './App.css';
import './css/Board.css';
import React from 'react';
import myPage from './NavigateBar/Board';
import { db,_apiKey } from './firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

import './TestContent.css'

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
  const [isLogined,setisLogined] = useState(false);
  const [testSubject, setTestSubject] = useState("");
  const [testContent, setTestContent] = useState([]);
  const [testRange, setTestRange] = useState(20);
  const [boardData,setBoardData] = useState([]);
  const [isAnswerShown, setIsAnswerShown] = useState([]);

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

  async function importTest() {
    const contentArray = [];
    for (let index = 1; index <= testRange; index++) {
        var strIndex = (index).toString();
        const docRef = doc(db, testSubject, strIndex);
      try{
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          contentArray.push(docSnap.data());
        } else {
          console.error("No such Document");
        }
      } catch (error) {
        console.error("Error getting doc",error);
      }

    }
    setTestContent(contentArray);
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
          setuData(user.uid);
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
    } catch (error) {

    }

  };

  const handleClick = (e) => {
    if(!isSignin)
      setisSignin(true);
    else
      setisSignin(false);
  };

  const answerClick = (index) => {
    setIsAnswerShown((prev) => {
      const updatedAnswers = [...prev];
      updatedAnswers[index] = true; // 해당 인덱스만 true로 설정
      return updatedAnswers;
    });
  };

  const insBtnClick = (e) =>{
    e.preventDefault();
      userAdd({
        uid:inputid,
        upass:inputpwd});
  }

  const testButtonClick = (e) => {
    e.preventDefault();
    const range = e.target.getAttribute("data-range");
    setIsAnswerShown([]);
    testAct(value, range);
  }

  const pageUp = (e) => {
    e.preventDefault();
    switch(e.target.value){
      case "mypage":
        alert("aa");
        navigate('/myPage');
      break;
    }
  }

  async function testAct(select, range) {
    switch(select){
      case "EIP_PT_2021_3":
        setTestSubject("eIP_pT_2021_3");
        break;
      case "EIP_PT_2022_1":
        setTestSubject("engineerInformationProcessing_pT_2022_1");
        break;
      default:
        break;
    }
    setTestRange(Number(range));
  }

  //최초 마운트 시 getTest import
  useEffect(() => {
    console.log(db);
    try {
      getTest();
      getBoard();
      const unsubcribe = onAuthStateChanged(auth,(user)=>{
        if(user){
          setisLogined(true);
          setuData(user.uid);
        }else{
          setisLogined(false);
        }
      });

      if (testSubject) {
        // alert(testSubject);
        importTest();
        setTestSubject("");
      }

      return unsubcribe;
    } catch (error) {
      console.log(error);
    }
  }, [testSubject]);

  return (

    <div className='container'>
      <div className='app'>
        <div className='header'>
          <span>
            <h1>quiz test</h1>
          </span>
          <div id="navigateDiv">
            <ul className="navigateBar">
              <li><a>게시판</a></li>
              <li><a>문제풀기</a></li>
              <li><a>About</a></li>
              <li><a href='/NavigateBar/Board'>마이페이지</a></li>
            </ul>
          </div>
        </div>

        <div className='content'>
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
          <div>
            {uData}
            <br></br>
            <button onClick={logout}>logout</button>
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
              <button type="submit">dbins</button>
              <button onClick={handleClick}>back</button>
          </form>
        }
          </div>
          <div className='boardDiv'>
            <div className='boardTopDiv'>
              <div id='boardHead'><h2>공지사항</h2></div>
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
                    <div className='boardAuthor'>{item.author}</div>
                    <div className='boardDate'>{item.date.toLocaleDateString()}</div>
                  </li>  
                ))}
              </ul>
            </div>
          </div>
          <p><span> </span></p>{/*몇번 문제 출력*/}
          <h1> </h1> {/*문제 내용 출력*/}
          <div> {/*db 불러옴*/}
            {test !== undefined &&
            <div>{test.uid}</div>}

            <div>{uData}</div>

          </div>
          <div id="selectTestDiv">
            <button onClick={testButtonClick} value="EIP_PT_2021_3" data-range="20">정보처리기사 실기시험 2021년 3회</button>
            <button onClick={testButtonClick} value="EIP_PT_2022_1" data-range="20">정보처리기사 실기시험 2022년 1회</button>
          </div>
          <div>
            {testContent.length > 0 &&
              testContent.map((content, index) => (
                <div className="QuestionForm" key={index}>
                  <div>문제 {content.num}번</div>
                  <div>제목: {content.title}</div>
                  <div>설명: {content.description}</div>
                  <div>정답: <textarea></textarea></div>
                  
                  <div
                    className={`Answer ${isAnswerShown[index] ? 'clicked' : ''}`}
                    onClick={() => answerClick(index)}
                  >
                    {!isAnswerShown[index] && (
                      <div className="AnswerCover">
                        <span className="AnswerClicker">정답 보기 (클릭)</span>
                      </div>
                    )}
                    <div className={`AnswerFadeIn ${isAnswerShown[index] ? 'visible' : ''}`}>
                      <span className="AnswerText">
                        {content.answer}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

    </div>

  );
}

export default App;
