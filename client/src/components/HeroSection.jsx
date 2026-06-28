import React from 'react';
import { Sun, Moon, Flame, TrendingUp, Leaf, DollarSign } from 'lucide-react';

const HeroSection = ({ theme, onToggleTheme }) => {
  const metrics = [
    { Icon: Flame, color: 'cyan', value: '84×', label: '20-Year GWP', delay: 1 },
    { Icon: TrendingUp, color: 'emerald', value: '1,920', label: 'CH₄ PPB (2024)', delay: 2 },
    { Icon: Leaf, color: 'amber', value: '~40%', label: 'Agriculture Share', delay: 3 },
    { Icon: DollarSign, color: 'rose', value: '$2.1B', label: 'Cost Per Mt', delay: 4 },
  ];

  return (
    <div className="hero-section">
      <button className="theme-toggle" onClick={onToggleTheme}>
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <h1>Methane's Hidden Tax</h1>

      <p className="hero-subtitle">
        An atmospheric visualization and economic damage prediction model measuring the true cost of global methane. Track the trajectory, identify the sources, and calculate the cost of inaction.
      </p>

      <div className="metric-grid">
        {metrics.map(({ Icon, color, value, label, delay }) => (
          <div className={`metric-card ${color} animate-in animate-delay-${delay}`} key={label}>
            <div className={`metric-icon ${color}`}>
              <Icon size={20} />
            </div>
            <div className="metric-value">{value}</div>
            <div className="metric-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
