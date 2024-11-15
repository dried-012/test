import React from 'react';
import '../css/Board.css';
import { db,_apiKey } from '../firebase';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp, addDoc } from 'firebase/firestore';
import { getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

function BoardRead() {
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
    const location = useLocation();
    const {item} = location.state || {};

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
            dataArray.push({id:doc.id,...docData}); 
          });
          setBoardData(dataArray);
        } catch (error) {
          console.log(error);
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
                <div className='title'></div>
                <div className='author'></div>
                <div className='content'></div>
                <div className='date'></div>
            </div>
          </div>
        </div>
    )
}

export default BoardRead;
