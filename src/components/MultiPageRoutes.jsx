import Home from "./home/Home";
import About from "./about/About";
import Teaching from "./teaching/Teaching";
import Services from "./services/Services";
import Publications from "./publications/Publications";
import News from "./news/News";
import Supervision from './supervision/Supervision';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export default function MultiPageRoutes() {
    return (
        <Routes>
            <Route exact path={'/'} element={<Home />} />
            <Route exact path={'/news'} element={<News />} />
            <Route exact path={'/about'} element={<About />} />
            <Route exact path={'/supervision'} element={<Supervision />} />
            <Route exact path={'/services'} element={<Services />} />
            <Route exact path={'/teaching'} element={<Teaching />} />
            <Route exact path={'/publications'} element={<Publications />} />
        </Routes>
    )
}
