import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { db,_apiKey } from '../firebase';
import DOMPurify from 'dompurify';

function Test(){
  const navigate = useNavigate();
  const [testList, setTestList] = useState([]);
  const [selectedTestName, setSelectedTestName] = useState("");
  const [selectedCollectionName, setSelectedCollectionName] = useState("");
  const [selectedDocContent, setSelectedDocContent] = useState(null);
  const [isCoverVisible, setIsCoverVisible] = useState({});
  const [checkResults, setCheckResults] = useState({});
  const [clickedTestTitle, setClickedTestTitle] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentState, setCurrentState] = useState("default");
  const [answers, setAnswers] = useState({});

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

  const testListButtonClick = async (e) => {
    e.preventDefault();
    const collectionName = e.target.value;
    const testTitle = e.target.getAttribute("data-title");
    setClickedTestTitle(null);
    setSelectedDocContent(null);
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
    
  const toggleAnswerCover = (questionKey) => {
    setIsCoverVisible((prev) => ({
      ...prev,
      [questionKey]: !prev[questionKey],  // 기존 상태의 반대로 토글
    }));
  };
    
  const handleDocClick = async (docId) => {
    const docRef = doc(db, selectedCollectionName, docId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedDocContent(data);
        setIsCoverVisible({});
        setCheckResults({});
        setClickedTestTitle(formatDocName(docId));
        setAnswers({});

        const questionCount = Object.keys(data).length;
        setTotalQuestions(questionCount);
      } else {
        console.error("Document does not exist!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const handleCheck = (key, value) => {
    setCheckResults((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getTotalCount = (type) => {
    return Object.values(checkResults).filter((result) => result === type).length;
  };

  const handleReset = () => {
    setTestList([]);
    setSelectedDocContent(null);
    setIsCoverVisible({});
    setCheckResults({});
    setClickedTestTitle(null);
    setSelectedTestName(null);
  }

  const stateTransitions = {
    default: "confirmEndTest",
    confirmEndTest: {
      yes: "saveTest",
      no: "default",
    },
    saveTest: {
      yes: "default",
      no: "default",
    },
  };

  const handleStateChange = (action) => {
    const nextState = stateTransitions[currentState];
    if (typeof nextState === "string") {
      setCurrentState(nextState);
    } else {
      setCurrentState(nextState[action]);
    }
  };

  const isBothNull = !clickedTestTitle && !selectedTestName;
  const answeredQuestions = Object.values(checkResults).filter(value => value === "correct" || value === "wrong").length;
  const correctAnswers = Object.values(checkResults).filter(value => value === "correct").length;
  const wrongAnswers = Object.values(checkResults).filter(value => value === "wrong").length;
  const score = correctAnswers * 5;
  const isAllAnswered = answeredQuestions === totalQuestions;
  const isPass = score >= 60;

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

        <div>

          <div id="testMainDiv">
            <div id="testMainDivInside" className="Inside">


              <div id="testMainListDiv">
                <div id="testMainListDivInside" className="Inside">
                  <div id="testMainListButtonDiv" className="TestWidth">
                    <div id="testMainListButtonDivInside" className="Inside">
                      <div>
                        <button onClick={handleReset}>
                          초기화
                        </button>
                        <br></br>
                        <button onClick={testListButtonClick} value="eIP_wT" data-title="정보처리기사 필기">
                          정보처리기사 필기
                        </button>
                        <button onClick={testListButtonClick} value="eIP_pT" data-title="정보처리기사 실기">
                          정보처리기사 실기
                        </button>
                      </div>
                      <div>
                      {testList.map((docName, index) => (
                          <button key={index} onClick={() => handleDocClick(docName)} value={docName}>
                          {formatDocName(docName)}
                          </button>
                      ))}
                      </div>                      
                    </div>
                  </div>
                </div>
              </div>

              <div id="testMainTitleDiv">
                <div id="testMainTitleDivInside" className="Inside">
                  <div id="testMainTitleOnDiv" className="TestWidth">
                    <div id="testMainTitleOnDivInside" className="Inside">
                      <div id="test-TitleDiv" className="MIDDLE">
                        {!isBothNull && (
                          <h1 className="test-title">
                            {clickedTestTitle || selectedTestName}
                          </h1>
                        )}
                        {isBothNull && (
                          <h1 className="test-title">시험을 선택하세요</h1>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="testMainSubjectDiv">
                <div id="testMainSubjectDivInside" className="Inside">
                  <div id="testMainSubjectSetDiv" className="TestWidth">
                    <div id="testMainSubjectSetDivInside" className="Inside">
                      
                    </div>
                  </div>
                </div>
              </div>

              <div id="testMainContentDiv">
                <div id="testMainContentDivInside" className="Inside">
                  <div id="testMainContentQuestionDiv" className="TestWidth">
                    <div id="testMainContentQuestionDivInside" className="Inside">

                    <div id="testMainContentQuestionUpdateDiv">
                    {selectedDocContent && (
                        <div id="question-block-pack">
                        {Object.keys(selectedDocContent).map((key) => {
                            const field = selectedDocContent[key];
                            const isCoverVisibleForKey = isCoverVisible[key];

                            return (
                              <div
                                key={key}
                                className="question-block"
                              >
                                
                                <p><span className="testNum">{field.num}</span> <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(field.title) }}></span></p>

                                {field.description && (
                                  <div className="DESCRIPTION" dangerouslySetInnerHTML={{ __html: field.description }} />
                                )}

                                {field.image && (
                                  <div className="IMAGE">
                                    <img src={require(`../TestImage/${field.image}.png`)} alt={field.image} />
                                  </div>
                                )}

                                <div>
                                  <p className="ANSWER">
                                    <textarea 
                                    className="testInsert" 
                                    placeholder="답 입력" 
                                    value={answers[key] || ""}
                                    onChange={(e) =>
                                      setAnswers((prev) => ({
                                        ...prev,
                                        [key]: e.target.value,
                                      }))
                                    }>
                                    </textarea>
                                  </p>
                                </div>
                                <div>
                                  <div className="AnswerBox">
                                    {!isCoverVisibleForKey && (
                                      <div className="AnswerCover" onClick={() => toggleAnswerCover(key)}>
                                        정답 및 해설 열기 (답 체크)
                                      </div>
                                    )}
                                    <div>
                                      <p className="AnswerCoverOn" onClick={() => toggleAnswerCover(key)}>정답 및 해설 닫기</p>
                                      <p dangerouslySetInnerHTML={{ __html: `정답: ${field.answer}` }}></p>
                                      <p dangerouslySetInnerHTML={{ __html: `해설: ${field.explanation}` }}></p>
                                      <div className="check-buttons">
                                        <button
                                          onClick={() => handleCheck(key, "correct")}
                                          style={{
                                            backgroundColor: checkResults[key] === "correct" ? "lightgreen" : "",
                                          }}
                                        >
                                          정답
                                        </button>
                                        <button
                                          onClick={() => handleCheck(key, "wrong")}
                                          style={{
                                            backgroundColor: checkResults[key] === "wrong" ? "lightcoral" : "",
                                          }}
                                        >
                                          오답
                                        </button>
                                        <button
                                          onClick={() => handleCheck(key, null)}
                                          style={{
                                            backgroundColor: checkResults[key] === null ? "" : "",
                                          }}
                                        >
                                          초기화
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          );
                         })}
                        </div>
                        )}
                      </div>

                      <div id="checkCOrWDiv">
                      {clickedTestTitle &&
                        <div>

                          <div className="CheckQuestion">
                            <div>
                              [숫자 ex) 1]
                            </div>
                            <div>
                              [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                          <div className="CheckQuestion">
                            <div>
                            [숫자 ex) 2]
                            </div>
                            <div>
                            [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                          <div className="CheckQuestion">
                            <div>
                            [숫자 ex) ...20]
                            </div>
                            <div>
                            [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                          <div className="CheckQuestion">
                            <div>
                            [숫자 ex) ...20]
                            </div>
                            <div>
                            [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                          <div className="CheckQuestion">
                            <div>
                            [숫자 ex) ...20]
                            </div>
                            <div>
                            [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                          <div className="CheckQuestion">
                            <div>
                            [숫자 ex) ...20]
                            </div>
                            <div>
                            [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                          <div className="CheckQuestion">
                            <div>
                            [숫자 ex) ...20]
                            </div>
                            <div>
                            [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                          <div className="CheckQuestion">
                            <div>
                            [숫자 ex) ...20]
                            </div>
                            <div>
                            [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                          <div className="CheckQuestion">
                            <div>
                            [숫자 ex) ...20]
                            </div>
                            <div>
                            [기본 ? | 선택에 따라 O / X]
                            </div>
                          </div>

                        </div>
                        }
                      </div>

                    </div>

                  </div>

                </div>
              </div>

              <div id="testMainSelectDiv">
                <div id="testMainSelectDivInside" className="Inside">
                  <div id="testMainSelectPreDiv" className="TestWidth">
                    <div id="testMainSelectPreDivInside" className="Inside">
                      
                    </div>
                  </div>
                </div>
              </div>

              <div id="testMainFooterDiv">
                <div id="testMainFooterDivInside" className="Inside">
                  <div id="testMainFooterFinishDiv" className="TestWidth">
                    <div id="testMainFooterFinishDivInside" className="Inside">

                    {clickedTestTitle &&
                      <div id="testProgress" className="RELATIVE">
                          
                        <div id="testProgressLeft" className="ABSOLUTE LEFT UP HALFQUAD">
                          <div id="testProgressLeftIn" className="Inside RELATIVE">
                            <div id="testProgressLeftUp" className="ABSOLUTE UP HORIZONTALRECTANGULAR">
                              <div id="testProgressLeftUpIn" className="Inside MIDDLE">
                                <h3>푼 문제 개수 / 총 문제 개수</h3>
                              </div>
                            </div>
                            <div id="testProgressLeftDown" className="ABSOLUTE DOWN HORIZONTALRECTANGULAR">
                              <div id="testProgressLeftDownIn" className="Inside MIDDLE">

                                <p><h2>{answeredQuestions} / {totalQuestions}</h2></p>
                                
                              </div>
                            </div>
                          </div>
                        </div>
                          

                        <div id="testProgressRight" className="ABSOLUTE RIGHT UP HALFQUAD">
                          <div id="testProgressRightIn" className="Inside RELATIVE">
                            <div className="ABSOLUTE UP HORIZONTALRECTANGULAR">
                              <div className="Inside MIDDLE">
                                <h4>선택한<br></br>정답 수 / 오답 수</h4>
                              </div>
                            </div>
                            <div className="ABSOLUTE DOWN HORIZONTALRECTANGULAR">
                              <div className="Inside MIDDLE">
                                <p><h3>
                                  {correctAnswers}
                                  &nbsp;/&nbsp;
                                  {wrongAnswers}
                                </h3></p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div id="testProgressLeft_bottom" className="ABSOLUTE LEFT DOWN HALFQUAD">
                          <div id="testProgressLeft_bottomIn" className="Inside RELATIVE">
                            <div className="ABSOLUTE UP HORIZONTALRECTANGULAR">
                              <div className="Inside MIDDLE">
                                <h1>예상 점수</h1>
                              </div>
                            </div>
                            <div className="ABSOLUTE DOWN HORIZONTALRECTANGULAR">
                              <div className="Inside MIDDLE">
                                <p><h2>{score}</h2></p>
                              </div>
                            </div>                         
                          </div>
                        </div>

                        <div id="testProgressRight_bottom" className="ABSOLUTE RIGHT DOWN HALFQUAD">
                          <div id="testProgressRight_bottomIn" className="Inside">
                            {isAllAnswered &&
                            <div className="Inside RELATIVE">
                              <div className="ABSOLUTE UP HORIZONTALRECTANGULAR">
                                <div className="Inside MIDDLE">
                                  {isPass &&
                                    <p>합격입니다.</p>
                                  || !isPass &&
                                    <p>불합격입니다.</p>
                                  }
                                </div>
                              </div>
                              
                              <div className="ABSOLUTE DOWN HORIZONTALRECTANGULAR">
                                <div className="Inside MIDDLE">
                                  
                                </div>
                              </div>
                            </div>
                            || !isAllAnswered &&
                            <div className="Inside RELATIVE">
                              

                              {currentState === "default" && (
                              <>
                              <div className="ABSOLUTE UP HORIZONTALRECTANGULAR">
                                <div className="Inside MIDDLE">
                                  시험 종료시
                                  풀지 않은 문제는 오답 처리합니다.
                                </div>
                              </div>
                              
                              <div className="ABSOLUTE DOWN HORIZONTALRECTANGULAR">
                                <div className="Inside MIDDLE">
                                  <button onClick={() => handleStateChange()}>시험 종료</button>
                                </div>
                              </div>
                              </>
                              )}

                              {currentState === "confirmEndTest" && (
                              <>
                              <div className="ABSOLUTE UP HORIZONTALRECTANGULAR">
                                <div className="Inside MIDDLE">
                                  정말로 시험을 종료하시겠습니까?
                                </div>
                              </div>
                              
                              <div className="ABSOLUTE DOWN HORIZONTALRECTANGULAR">
                                <div className="Inside MIDDLE">
                                  <button onClick={() => handleStateChange("yes")}>네</button>
                                  <button onClick={() => handleStateChange("no")}>아니오</button>
                                </div>
                              </div>
                              </>
                              )}

                              {currentState === "saveTest" && (
                              <>
                              <div className="ABSOLUTE UP HORIZONTALRECTANGULAR">
                                <div className="Inside MIDDLE">
                                  시험을 저장하시겠습니까?
                                </div>
                              </div>
                              
                              <div className="ABSOLUTE DOWN HORIZONTALRECTANGULAR">
                                <div className="Inside MIDDLE">
                                  <button
                                    onClick={() => {
                                      alert("시험이 저장되었습니다!");
                                      handleStateChange("yes");
                                      handleReset();
                                    }}
                                  >
                                    네
                                  </button>
                                  <button onClick={() => 
                                  {
                                    handleStateChange("no");
                                    handleReset();
                                  }}>아니오</button>
                                </div>
                              </div>
                              </>
                              )}


                            </div>
                            }

                          </div>
                        </div>
                        

                      </div>

                      }
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>

        </div>

      </div>
    );
}

export default Test;