import React from 'react';
import '../css/Board.css';
import '../css/BoardRead.css';
import { db, _apiKey } from '../firebase';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

function BoardRead() {
  const navigate = useNavigate();
  const [boardData, setBoardData] = useState([]);
  const [clickedBoardData, setClickedBoardData] = useState();
  const auth = getAuth();
  const [uData, setuData] = useState();
  const [isLogined, setisLogined] = useState(false);
  const location = useLocation();
  const { item } = location.state || {};

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

  const updateItem = (item) => {
    if (!uData || uData.email !== clickedBoardData?.author) {
      alert("수정 권한이 없습니다.");
      return;
    }
    navigate('/board', {
      state: {
        item
      }
    });
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

  const readBoard = async () => {
    const boardRef = item.id;
    const docRef = doc(db, "board", boardRef);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        let data = docSnap.data();
        if (data.date && data.date instanceof Timestamp) {
          data.date = data.date.toDate();
        }
        setClickedBoardData(data);
      } else {
        console.error("No such Document");
      }
    } catch (error) {

    }
  };

  const deleteBoard = async () => {
    if (!item?.id) {
      alert("삭제할 게시글이 없습니다.");
      return;
    }

    if (!uData || uData.email !== clickedBoardData?.author) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    try {
      const docRef = doc(db, "board", item.id);
      await deleteDoc(docRef);
      console.log(`문서 삭제 완료, 문서 id: ${item.id}`);
      alert("게시글이 삭제되었습니다.");
      navigate('/');
    } catch (error) {
      console.error('문서 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    try {
      getBoard();
      readBoard();
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
    <div className='wrap'>
      <div id="headerDiv">
        <span>
          <h1 onClick={PageRs}>quiz test</h1>
        </span>
        <div id="navigateDiv">
          <ul className="navigateBar">
            <li><button onClick={pageUp} value='board'>게시판</button></li>
            <li><button onClick={pageUp} value='mytest'>문제풀기</button></li>
            <li><button onClick={pageUp} value="about">About</button></li>
            <li><button onClick={pageUp} value='mypage'>마이페이지</button></li>
          </ul>
        </div>
        <div id='contentDiv'>
          <h2 className='cont_subject'>공지사항
            <div className='brBtnDiv'>
              <button className='brBtn' onClick={() => updateItem(item)}>수정하기</button>
              <span></span>
              <button className='brBtn' onClick={deleteBoard}>삭제하기</button>
            </div>
          </h2>
          <div className='title'>{clickedBoardData?.title}</div>
          <div className='author'><span>작성자 </span>{clickedBoardData?.author.split('@')[0]}</div>
          <div className='date'><span>날짜</span>{clickedBoardData?.date.toLocaleDateString()}</div>
          <div className='content'>{clickedBoardData?.subject}</div>
        </div>
        
      </div>
      <div className='footerDiv'>
        <div className='footerSubDiv'>
          <span>
            모든 문제들의 저작권은 원저작권자에게 있습니다. 본 사이트는 웹상에 공개되어 있는 문제만 모아서 보여드립니다.<br />
            <a>본 페이지는 상업적 목적이 아닌 개인 포트폴리오용으로 제작되었습니다.</a>
          </span>
        </div>
      </div>
    </div>
  )
}

export default BoardRead;
