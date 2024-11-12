import './App.css';
import './css/Board.css';
import React from 'react';
import MyPage from './NavigateBar/Board';
import MyTest from './NavigateBar/Test';
import MainPage from "./mainPage";
import { _apiKey } from './firebase';
import { Routes, Route } from 'react-router-dom'

import './TestContent.css'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/mypage" element={<MyPage/>}/>
        <Route path="/mytest" element={<MyTest/>}/>
      </Routes>
    </div>
  );
}

export default App;
