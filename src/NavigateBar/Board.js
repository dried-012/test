import React from "react";
import '../css/Board.css';
import { db,_apiKey } from '../firebase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { doc, collection, getDoc, getDocs, setDoc, updateDoc, getFirestore, Timestamp } from 'firebase/firestore';

function Board(){
    const navigate = useNavigate();
    const [boardData,setBoardData] = useState([]);

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
    useEffect(() => {
        try {
            getBoard();
        } catch (error) {
            
        }
    },);
    return(
        <div>
            local//Board
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
                {boardData.length > 0 &&
                 boardData.map((item, idx)=>(
                  <li key={idx}>
                    <div className='boardNo'>{idx+1}</div>
                    <div className='boardTitle'>{item.title}</div>
                    <div className='boardAuthor'>{item.author}</div>
                    <div className='boardDate'>{item.date.toLocaleDateString()}</div>
                  </li>  
                ))}
              </ul>
            </div>
          </div>
        </div>
    );
}

export default Board;