import React from 'react';
import { Database, Lightbulb } from 'lucide-react';

export function GraphCard({ title, children, source, insights }) {
  return (
    <div className='graph-card'>
      <div className='graph-card-header'>
        <h2 className='graph-card-title'>{title}</h2>
        <span className='graph-card-badge'>
          <Database size={12} />
          {source}
        </span>
      </div>
      <div className='graph-chart-area'>
        {children}
      </div>
      <div className='insight-box'>
        <h4>
          <Lightbulb size={14} />
          Key Insights
        </h4>
        <ul>
          {insights.map((insight, idx) => (
            <li key={idx}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
