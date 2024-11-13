import './App.css';
import React from 'react';
import MyPage from './NavigateBar/Mypage';
import Board from './NavigateBar/Board';
import MyTest from './NavigateBar/Test';
import MainPage from "./mainPage";
import { Routes, Route } from 'react-router-dom'

import './TestContent.css'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/mypage" element={<MyPage/>}/>
        <Route path="/mytest" element={<MyTest/>}/>
        <Route path="/board" element={<Board/>}/>
      </Routes>
    </div>
  );
}

export default App;
