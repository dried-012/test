import React from "react";
import '../css/Board.css';
import { db, _apiKey } from '../firebase';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';


function About() {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();

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

    return (
        <div className="wrapper">
            <span>
                <h1 onClick={() => navigate("/")}>quiz test</h1>
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
            <div className="contentDiv">
                <div id="conTitleDiv">
                    <span>about</span>
                </div>
                <div id="conSubjectDiv">
                    <p>이 웹사이트는 사용자가 문제를 풀고, 게시판을 통해 소통하며, 자신만의 테스트를 만들 수 있는 플랫폼입니다.</p>
                </div>
                <div id="conTeamDiv">
                    <h2>팀 소개</h2>
                    <p>이 프로젝트는 다음 팀원들에 의해 개발되었습니다:</p>
                    <ul>
                        <li>엄재민,이고호 - 풀스택 개발자</li>
                        <li>엄재민,이고호 - UI/UX 디자이너</li>
                        <li>엄재민,이고호 - 백엔드 개발자</li>
                    </ul>
                </div>
                <div id="conMotivationDiv">
                    <h2>프로젝트 배경</h2>
                    <p>이 사이트는 사용자들이 학습을 더욱 재미있고 효과적으로 할 수 있도록 설계되었습니다.</p>
                    <p>학습에 대한 접근성 개선</p>
                    <p>이 웹사이트는 사용자가 문제를 풀고, 자신의 학습 데이터를 관리하며, 다른 사용자들과 소통할 수 있도록 설계되었습니다.</p>
                    <p>개발자 역량 강화</p>
                    <p>최신 웹 기술(Firebase, React, CSS 등)을 적용하고, 실질적인 사용자 경험을 반영하여 개발 역량을 성장시키는 데 중점을 두었습니다</p>
                </div>
                <div id="conTechDiv">
                    <h2>사용된 기술</h2>
                    <ul>
                        <li>프론트엔드: React.js, java script</li>
                        <li>백엔드: Firebase</li>
                        <li>스타일링: CSS</li>
                    </ul>
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

export default About;