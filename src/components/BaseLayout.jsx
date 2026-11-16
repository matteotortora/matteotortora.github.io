import React, { useEffect, useRef, useState } from 'react';
import Style from './BaseLayout.module.scss'
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import MultiPageRoutes from './MultiPageRoutes';
import { singlePage } from '../info/Info';
import site from '../info/site.json';
import SinglePageRoutes from './SinglePageRoutes';
import useScrollObserver from '../hooks/useScrollObserver';
import { initializeTheme, applyTheme, saveTheme } from '../theme.mjs';
import BackgroundSceneBoundary from './background/BackgroundSceneBoundary';

export default function BaseLayout() {
   const location = useLocation()

   const [active, setActive] = useState('home');
   const initialHash = useRef(location.hash);
   const refHome = useScrollObserver(setActive);
   const refNews = useScrollObserver(setActive);
   const refAbout = useScrollObserver(setActive);
   const refSupervision = useScrollObserver(setActive);
   const refTeaching = useScrollObserver(setActive);
   const refServices = useScrollObserver(setActive);
   const refPublications = useScrollObserver(setActive);
   const [darkMode, setDarkMode] = useState(false);
   const [themeReady, setThemeReady] = useState(false);
   const [backgroundPaused, setBackgroundPaused] = useState(false);
   const showBackground = useMediaQuery('(min-width: 56.25rem) and (hover: hover) and (pointer: fine)', {noSsr: true});

   useEffect(() => {
      setDarkMode(initializeTheme() === 'dark');
      setThemeReady(true);
   }, []);

   useEffect(() => {
      if (themeReady) applyTheme(darkMode ? 'dark' : 'light');
   }, [darkMode, themeReady]);

   useEffect(() => {
      setActive(location.hash.slice(1) || (location.pathname === '/' ? 'home' : location.pathname.slice(1)));
   }, [location.hash, location.pathname]);

   function toggleTheme() {
      const next = !darkMode;
      applyTheme(next ? 'dark' : 'light');
      saveTheme(next ? 'dark' : 'light');
      setDarkMode(next);
   }

   useEffect(() => {
      if (!singlePage || !initialHash.current) return;
      let cancelled = false;
      function alignInitialSection() {
         if (cancelled || window.location.hash !== initialHash.current) return;
         const section = document.getElementById(initialHash.current.slice(1));
         if (section) {
            section.scrollIntoView({ behavior: 'instant', block: 'start' });
            section.focus({ preventScroll: true });
         }
      }
      const frame = requestAnimationFrame(alignInitialSection);
      document.fonts?.ready.then(alignInitialSection);
      return () => { cancelled = true; cancelAnimationFrame(frame); };
   }, []);

   return (
      <Box className={Style.layout}>
         <a className="skip-link" href="#main-content">Skip to content</a>
         {themeReady && showBackground && <BackgroundSceneBoundary darkMode={darkMode} paused={backgroundPaused}
            onTogglePause={() => setBackgroundPaused(value => !value)} />}
         <Grid container className={Style.content} display={'flex'} flexDirection={'column'} minHeight={'100vh'}
            justifyContent={'space-between'}>
            <Grid item>
               <Navbar darkMode={darkMode} onToggleTheme={toggleTheme} active={active} setActive={setActive} />
            </Grid>
            <Grid item component="main" id="main-content" tabIndex={-1} flexGrow={1}
                  sx={{ minWidth: 0, paddingTop: singlePage ? 'var(--navigation-height)' : 0 }}>
               {singlePage ? <SinglePageRoutes refs={{refHome, refNews, refAbout, refSupervision, refTeaching, refServices, refPublications}}/> : <MultiPageRoutes />}
            </Grid>
            <Grid item>
               <Box component={'footer'} display={'flex'} flexDirection={'column'} alignItems={'center'}
                  py={'1.5rem'} sx={{ opacity: 0.7 }} width={'100%'}>
                  <p suppressHydrationWarning>&copy; {new Date().getFullYear()} {site.name}</p>
               </Box>
            </Grid>
         </Grid>
      </Box>
   )
}
