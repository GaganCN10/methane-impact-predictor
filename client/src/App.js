import React, { useState, useEffect } from 'react';
import './styles/theme.css';
import HeroSection from './components/HeroSection';
import { Home } from './pages/Home';
import { PredictionPanel } from './components/PredictionPanel';

function App() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('methane-theme') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('methane-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className='app-shell'>
            <HeroSection theme={theme} onToggleTheme={toggleTheme} />
            <Home />
            <div className='dashboard-container'>
                <PredictionPanel />
            </div>
            <footer className='app-footer'>
                Academic Grade Project: Visualizations sourced from NOAA, EDGAR v8.0, and FAOSTAT. Model inputs feature World Bank economic data.
            </footer>
        </div>
    );
}

export default App;
