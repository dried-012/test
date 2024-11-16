import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { db,_apiKey } from '../firebase';
function Test(){
    const navigate = useNavigate();
    const [testList, setTestList] = useState([]);
    const [selectedTestName, setSelectedTestName] = useState("");
    const [selectedCollectionName, setSelectedCollectionName] = useState("");
    const [selectedDocContent, setSelectedDocContent] = useState(null);
    const [answerVisible, setAnswerVisible] = useState({});

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
            setAnswerVisible({});
          } else {
            console.error("Document does not exist!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      };

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
                            const isVisible = answerVisible[key]; // 각 문제별 정답 표시 상태

                            return (
                              <div key={key} className="question-block">
                                
                                
                                <p><span className="testNum">{field.num}</span> {field.title}</p>
                                <p>{field.description}</p>
                                
                                <div><p><textarea className="testInsert" placeholder="답 입력"></textarea></p></div>
                                <div>
                                    <div>
                                        <div onClick={() => toggleAnswer(key)}>
                                        {!isVisible && (
                                            <div>
                                            <p><span className="AnswerClicker">정답 및 해설 보기 (클릭)</span></p>
                                            <p><br></br></p>
                                            </div>
                                        )}
                                        {isVisible && (
                                            <div>
                                            <p>정답: {field.answer}</p>
                                            <p>해설: {field.explanation}</p>
                                            </div>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                          );
                         })}
                        </div>
                        )}
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