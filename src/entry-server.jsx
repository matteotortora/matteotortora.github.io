import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

export function render() {
    return renderToString(
        <React.StrictMode>
            <App Router={StaticRouter} routerProps={{ location: '/' }} />
        </React.StrictMode>,
    );
}
