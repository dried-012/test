import React from "react";
import '../css/Board.css';
import { db, _apiKey } from '../firebase';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

function Board() {
  const navigate = useNavigate();
  const location = useLocation();
  const [boardData, setBoardData] = useState([]);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const auth = getAuth();
  const [uData, setuData] = useState();
  const [inputid, setInputid] = useState();
  const [inputpwd, setInputpwd] = useState();
  const [isSignin, setisSignin] = useState(false);
  const [isLogined, setisLogined] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [boardCon, setBoardCon] = useState(false);
  const {item} = location.state || {};
  const [boardRead, setBoardRead] = useState();

  async function getBoard() {
    const dataArray = [];
    const collRef = collection(db, "board");
    const getDbContent = await getDocs(collRef);
    getDbContent.forEach((doc) => {
      const docData = doc.data();
      if (docData.date && docData.date instanceof Timestamp) {
        docData.date = docData.date.toDate();
      }
      dataArray.push(docData);
    });
    setBoardData(dataArray);
  }

  useEffect(() => {
    const fetchBoardData = async () => {
      try{
        if(item){
          console.log(item.id)
          setBoardCon(true);
          const data = await readBoard();
          if(data){
            setTitle(data.title||"");
            setSubject(data.subject||"");
            setFile(data.file||null);
          }
        }
      }catch(error){
        console.log(error);
      }
    };
    fetchBoardData();
  },[item]);

  const pageUp = (e) => {
    e.preventDefault();
    switch (e.target.value) {
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

  const userjoin = async (e) => {
    e.preventDefault();
    if (document.getElementById("checkPass").value == password) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const { stsTokenManager, uid } = user;
        handleClick();
        setEmail('');
        setPassword('');
        navigate('/');
      } catch (error) {
        if (error.message !== "Firebase: Error (auth/email-already-in-use).") {
          alert(error.message);
        }
        alert("이미가입된 이메일입니다");
      }
    } else {
      alert("비밀번호가 다릅니다");
    }
  }

  async function getBoard() {
    const dataArray = [];
    const collRef = collection(db, "board");
    try {
      const getDbContent = await getDocs(collRef);
      getDbContent.forEach((doc) => {
        const docData = doc.data();
        if (docData.date && docData.date instanceof Timestamp) {
          docData.date = docData.date.toDate();
        }
        dataArray.push({ id: doc.id, ...docData });
      });
      setBoardData(dataArray);
    } catch (error) {
      console.log(error);
    }
  }

  async function userAdd(data) {
    var userRef = null;
    var userNumber = null;
    const docRef = doc(db, "countDB", "counter");
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        userNumber = docSnap.data().userNum;
        userRef = doc(db, "item", (userNumber).toString());
        userNumber++;
        await updateDoc(docRef, {
          userNum: userNumber
        })
      }
      await setDoc(userRef, data);
    } catch (error) {
      console.log(error);
    }
  }

  const login = async (e) => {
    e.preventDefault();
    try {
      setPersistence(auth, browserSessionPersistence).then(() => {
        signInWithEmailAndPassword(auth, email, password).then((result) => {
          setisLogined(true);
          console.log(result);
          const user = result.user;
          setuData({
            uid: user.uid,
            email: user.email
          });
          navigate('/');
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  const logout = async (e) => {
    try {
      await signOut(auth).then(() => {
        setEmail('');
        setPassword('');
        setisLogined(false);
        navigate('/');
      }).catch((error) => {
        console.log(error.message);
      });
    } catch(error) {
      console.log(error);
    }
  };


  const insBtnClick = async (e) => {
    e.preventDefault();
    if (!title || !subject) {
      alert('제목과 본문을 모두 입력해 주세요.');
      return;
    }
    try {
      const newData = {
        title: title,
        subject: subject,
        file: file ? file.name : null,
        date: Timestamp.now(),
        author: uData.email,
      };
      if (item&&item?.id) {
        // 기존 문서 업데이트
        const docRef = doc(db, "board", item.id);
        await updateDoc(docRef, newData);
        console.log(`문서 업데이트 완료, 문서 id: ${item.id}`);
        alert("게시글이 업데이트되었습니다.");
      } else {
        // 새 문서 추가
        const docRef = await addDoc(collection(db, "board"), newData);
        console.log(`문서 추가 완료, 문서 id: ${docRef.id}`);
        alert("새 게시글이 등록되었습니다.");
      }
      setTitle('');
      setSubject('');
      setFile(null);
    } catch (error) {
      console.error('Firestore에 데이터 삽입 실패:', e);
      console.log(error.message)
      alert('게시글 등록에 실패했습니다.');
    }
    navigate("/board");
  }

  const handleClick = (e) => {
    if (!isSignin)
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

  const boardClicked = (item) => {
    navigate('/boardRead', {
      state: {
        item
      }
    });
  }

  const readBoard = async() =>{
    const boardRef = item.id;
    const docRef = doc(db,"board",boardRef);
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists){
        let data = docSnap.data();
        if(data.date && data.date instanceof Timestamp){
          data.date = data.date.toDate();
        }
        return data;
      }else {
        console.error("No such Document");
        return null;
      }
    }catch(error){

    }
  };

  useEffect(() => {
    try {
      getBoard();
      const unsubcribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setisLogined(true);
          setuData({
            uid: user.uid,
            email: user.email
          });
        } else {
          setisLogined(false);
        }
      });
      return unsubcribe;
    } catch (error) {
      console.log(error);
    }
  }, []);


  return (
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
      {!isLogined && !isSignup ? (
              <form onSubmit={login}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@xxxxx.com"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  required
                />
                <button type="submit">로그인</button>
                <button type="button" onClick={() => setIsSignup(true)}>회원가입</button>
              </form>
            ) : !isLogined && isSignup ? (
              <form onSubmit={userjoin}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@xxxxx.com"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  required
                />
                <input
                  type="password"
                  id="checkPass"
                  placeholder="비밀번호 확인"
                  required
                />
                <button type="submit">회원가입</button>
                <button type="button" onClick={() => setIsSignup(false)}>취소</button>
              </form>
            ) : (
              <div className="dataDiv">
                {uData?.email}
                <button onClick={logout}>로그아웃</button>
              </div>
            )}
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
              boardData.map((item, idx) => (
                <li key={item.id}>
                  <div className='boardNo'>{idx + 1}</div>
                  <div className='boardTitle' onClick={() => boardClicked(item)}>{item.title}</div>
                  <div className='boardAuthor'>{item.author.split('@')[0]}</div>
                  <div className='boardDate'>{item.date.toLocaleDateString()}</div>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className='boardConDiv'>
        <button onClick={() => setBoardCon((prev) => !prev)}>글쓰기</button>
        {boardCon &&
          <div className='boardWrDiv'>
            <form onSubmit={insBtnClick}>
              <span>제목</span>
              <div className='titleDiv'><input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              /></div>
              <span>본문</span>
              <div className='subjectDiv'>
                <textarea
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)} />
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
        }
      </div>
    </div>
  );
}

export default Board;