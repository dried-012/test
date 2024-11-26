import './App.css';
import './css/Board.css';
import './css/content.css';
import './css/footer.css';
import React from 'react';
import { db } from './firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

import './TestContent.css'

function App() {
  const [test, setTest] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const [uData, setuData] = useState();
  const [inputid, setInputid] = useState();
  const [inputpwd, setInputpwd] = useState();
  const navigate = useNavigate();
  const [isSignin, setisSignin] = useState(false);
  const [isLogined, setisLogined] = useState(false);
  const [boardData, setBoardData] = useState([]);

  async function getTest() {
    const docRef = doc(db, "item", "userid");
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTest(docSnap.data());
      } else {
        console.error("No such Document");
      }
    } catch (error) {
      console.error("Error getting doc", error);
    }
  }

  const userjoin = async (e) => {
    e.preventDefault();
    if (document.getElementById("checkPass").value == password) {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const { stsTokenManager, uid } = user;
        handleClick();
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
        dataArray.push({ id: doc.id, ...docData });//docData ...데이터풀기
      });
      dataArray.sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
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
        setuData(undefined);
        setisLogined(false);
        navigate('/');
      }).catch((error) => {
        console.log(error.message);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClick = (e) => {
    if (!isSignin)
      setisSignin(true);
    else
      setisSignin(false);
  };

  const insBtnClick = (e) => {
    e.preventDefault();
    userAdd({
      uid: inputid,
      upass: inputpwd
    });
  }

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
  const boardClicked = (item) => {
    navigate('/boardRead', {
      state: {
        item
      }
    });
  }
  //최초 마운트 시 getBoard import
  useEffect(() => {
    console.log(db);
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

    <div className='container'>
      <div className='app'>
        <div className='header'>
          <span>
            <h1>quiz test</h1>
          </span>
          <div id="navigateDiv">
            <ul className="navigateBar">
              <li><button onClick={pageUp} value='board'>게시판</button></li>
              <li><button onClick={pageUp} value='mytest'>문제풀기</button></li>
              <li><button onClick={pageUp} value="about">About</button></li>
              <li><button onClick={pageUp} value='mypage'>마이페이지</button></li>
            </ul>
          </div>
        </div>

        <div className='content'>
          <div id='textDiv'>
            <span>문제풀기를 선택하면 시작됩니다.</span>
          </div>
          <div id="loginDiv">
            {uData == undefined && !isSignin && !isLogined &&
              <form onSubmit={login}>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@xxxxx.com"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="비밀번호"
                  />
                </div>
                <button type="submit">login</button>
                <button onClick={handleClick}>signup</button>
              </form>
              || isLogined &&
              <div>
                {uData.email}
                <div><button onClick={logout}>logout</button></div>
              </div>
              || !isLogined && isSignin &&
              <form onSubmit={userjoin}>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@xxxxx.com"
                  />
                </div>
                <div><input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                {boardData.length > 0 && boardData.length <= 5 &&
                  boardData.map((item, idx) => (
                    <li key={item.id}>
                      <div className='boardNo'>{idx + 1}</div>
                      <div className='boardTitle' onClick={() => boardClicked(item)}>{item.title}</div>
                      <div className='boardAuthor'>{item.author ? item.author.split('@')[0] : 'Unknown Author'}</div>
                      <div className='boardDate'>{item.date ? item.date.toLocaleDateString() : 'Unknown Date'}</div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className='gridboxDiv'>
            <div className='gridDiv'>개발도구</div>
            <div className='gridDiv'></div>
            <div className='gridDiv'></div>
            <div className='gridDiv'>기술적 구현</div>
          </div>
        </div>
        <div className='footerDiv'>
          <div></div>
        </div>
      </div>

    </div>

  );
}

export default App;
