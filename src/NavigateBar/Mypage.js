import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp } from 'firebase/firestore';
import { db,_apiKey } from '../firebase';
import DOMPurify from 'dompurify';

function Mypage(){
    const navigate = useNavigate();

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

    return(
    <div>
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
            <div>
                마자
            </div>
            <div>
                루소
            </div>
            <div>
                생그
            </div>
        </div>
    </div>
    );
}

export default Mypage;