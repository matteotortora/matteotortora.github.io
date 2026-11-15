import React, { Component, lazy, Suspense } from 'react';

const NightSky = lazy(() => import('./NightSky'));
const EnergyPort = lazy(() => import('./EnergyPort'));

export default class BackgroundSceneBoundary extends Component {
    state = { failed: false };

    static getDerivedStateFromError() { return { failed: true }; }

    componentDidUpdate(previous) {
        if (previous.darkMode !== this.props.darkMode && this.state.failed) this.setState({failed:false});
    }

    render() {
        const {darkMode,paused,onTogglePause} = this.props;
        const Scene = darkMode ? NightSky : EnergyPort;
        return this.state.failed ? null : <Suspense fallback={null}><Scene paused={paused} onTogglePause={onTogglePause}/></Suspense>;
    }
}
