import './App.css';
import './css/Board.css';
import React from 'react';
import myPage from './NavigateBar/Board';
import MainPage from "./mainPage"
import { db,_apiKey } from './firebase';
import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
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
  const [testList, setTestList] = useState([]);
  const [selectedTestName, setSelectedTestName] = useState("");
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [selectedDocContent, setSelectedDocContent] = useState(null);
  const [answerVisible, setAnswerVisible] = useState({});

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

  const testListButtonClick = async (e) => {
    e.preventDefault();
    const collectionName = e.target.value;
    const testTitle = e.target.getAttribute("data-title");

    setSelectedTestName(testTitle);
    setSelectedCollectionName(collectionName);
    const collectionRef = collection(db, collectionName);
    try {
      const querySnapshot = await getDocs(collectionRef);
      const docNames = querySnapshot.docs.map(doc => doc.id);
      setTestList(docNames);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const formatDocName = (docName) => {
    const [year, round] = docName.split('_');
    return `${selectedTestName.split(' ')[0]} ${year}년 ${round}회 ${selectedTestName.split(' ')[1]}`;
  };

  const toggleAnswer = (questionKey) => {
    setAnswerVisible(prev => ({
      ...prev,
      [questionKey]: !prev[questionKey]
    }));
  };

  const handleDocClick = async (docId) => {
    const docRef = doc(db, selectedCollectionName, docId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedDocContent(data); // 전체 데이터를 상태에 저장
      } else {
        console.error("Document does not exist!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

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
    <div>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
