import React, { Component, lazy, Suspense } from 'react';

const NightSky = lazy(() => import('./NightSky'));

export default class NightSkyBoundary extends Component {
    state = { failed: false };

    static getDerivedStateFromError() { return { failed: true }; }

    render() {
        return this.state.failed ? null : <Suspense fallback={null}><NightSky /></Suspense>;
    }
}
