import React from 'react';
import './App.scss';
import BaseLayout from "./components/BaseLayout";
import {BrowserRouter} from "react-router-dom";

function App({ Router = BrowserRouter, routerProps = {} }) {
   return (
      <div>
         <Router {...routerProps}>
            <BaseLayout/>
         </Router>
      </div>
   );
}


export default App;
