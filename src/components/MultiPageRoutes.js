import Home from "./home/Home";
import About from "./about/About";
import Portfolio from "./portfolio/Portfolio";
import Services from "./services/Services";
import Publications from "./publications/Publications";
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export default function MultiPageRoutes() {
    return (
        <Routes>
            <Route exact path={'/'} element={<Home />} />
            <Route exact path={'/about'} element={<About />} />
            <Route exact path={'/portfolio'} element={<portfolio />} />
            <Route exact path={'/services'} element={<Services />} />
            <Route exact path={'/publications'} element={<Publications />} />
        </Routes>
    )
}