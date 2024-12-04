import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp, deleteField } from 'firebase/firestore';
import { db,_apiKey } from '../firebase';
import DOMPurify from 'dompurify';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

function Mypage(){
    const navigate = useNavigate();

    const auth = getAuth();
    const [uData, setuData] = useState();
    const [isLogined, setisLogined] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [isSignin, setisSignin] = useState(false);

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
                // navigate('/');
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
            //navigate('/');
          }).catch((error) => {
            console.log(error.message);
          });
        } catch(error) {
          console.log(error);
        }
    };

    const userjoin = async (e) => {
        e.preventDefault();
        if (document.getElementById("checkPass").value == password) {
            try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const { stsTokenManager, uid } = user;
            handleClick();
            setEmail('');
            setPassword('');
            //navigate('/');
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

    const handleClick = (e) => {
        if (!isSignin)
            setisSignin(true);
        else
            setisSignin(false);
    };
  
    useEffect(() => {
      try {
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

    const [testResults, setTestResults] = useState([]);
    const [testField, setTestField] = useState();
    const [deleteConfirm, setDeleteConfirm] = useState({});

    const testLoad = async () => {
      if (!uData?.email) {
        console.error("사용자 이메일이 없습니다!");
        return;
      }
      
      const saveRef = doc(db, "testComplete", "resultSave");
  
      try {
        const docSnap = await getDoc(saveRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          // 유저 이메일 기반 필터링
          const userFields = Object.entries(data).filter(([key]) =>
            key.startsWith((uData?.email).replace(/[^a-zA-Z0-9_]/g, ""))
          );
  
          if (userFields.length === 0) {
            console.log("이메일에 해당하는 데이터가 없습니다.");
            setTestField(false);
          } else {
            // 데이터 정렬: 최신 날짜순 (내림차순)
            const sortedResults = userFields
              .map(([key, value]) => value) // 필드 값만 추출
              .sort((a, b) => b.date.toDate() - a.date.toDate());
              setTestField(true);
            setTestResults(sortedResults);  // 데이터를 상태에 설정
          }
        } else {
          console.error("문서가 존재하지 않습니다!");
        }
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
      }
    };

    const handleDelete = async (result, key) => {
      // 삭제할 필드 이름 생성
      const fieldName = `${uData.email}_${result.timeSet}_${result.testList}_${result.docTest}`;
      const reFieldName = fieldName.replace(/[^a-zA-Z0-9_]/g, "");

      const saveRef = doc(db, "testComplete", "resultSave");
      try {
        // Firestore 필드 삭제
        await updateDoc(saveRef, {
          [reFieldName]: deleteField(),
        });
        alert("시험 기록이 삭제되었습니다.");
        setDeleteConfirm(key, false)
        // 삭제 후 데이터 새로고침
        await testLoad();
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제에 실패했습니다.");
      }
    };

    const checkDeleteConfirm = (key, value) => {
      setDeleteConfirm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    useEffect(() => {
      testLoad();
    }, [uData?.email]);

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
        <div className="myPageDiv">
            <div>
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
                        <div>
                            { isLogined && 
                                <div>
                                    <h1> {uData?.email} 님의 마이페이지 </h1>
                                </div>
                                || !isLogined &&
                                <div>
                                    <h1>로그인 후 마이페이지를 확인할 수 있습니다. </h1>
                                </div>
                            }
                        </div>
                    <div id="testArchive">{isLogined &&<h1>시험 기록{!testField && <span>이 존재하지 않습니다!</span>} </h1>}</div>
                    <ul>
                        {isLogined && testField &&
                        <li>
                        <div className="TestDate TESTTITLE">날짜</div>
                        <div className="TestTitle TESTTITLE">시험</div>
                        <div className="TestScore TESTTITLE">점수</div>
                        <div className="TestFinal TESTTITLE">결과</div>   
                        <div className="TestTermination TESTTITLE">기록</div>
                        </li>
                        }
                    </ul>
                    
                    </div>
                    <div className='boardBodyDiv'>
                    
                    <ul>
                        {isLogined && testField &&
                        <div>
                        {testResults.map((result, index) => (
                            <li key={index}>
                            <div className="TestDate">{result.date.toDate().toLocaleString()}</div>
                            <div className="TestTitle">{result.title}</div>
                            <div className="TestScore">{result.finalScore}</div>
                            <div className="TestFinal">{result.pass ? "합격" : "불합격"}</div>
                            {!deleteConfirm[index] &&
                            <div
                              className="TestTermination"
                              style={{ cursor: "pointer", color: "red" }}
                              onClick={() => checkDeleteConfirm(index, true)}
                            > 
                              삭제
                            </div>
                            || deleteConfirm[index] &&
                            <div className="TestTermination">
                              <div className="TestTerminationCheck" style={{ cursor: "pointer", color: "orange" }} onClick={() => handleDelete(result, index)}>
                                확인
                              </div>
                              <div className="TestTerminationCheck" style={{ cursor: "pointer", color: "green" }} onClick={() => checkDeleteConfirm(index, false)}>
                                취소
                              </div>
                            </div>
                            }
                            </li>
                        ))}
                        </div>
                        }

                    </ul>
                    
                    </div>
                </div>
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
    );
}

export default Mypage;