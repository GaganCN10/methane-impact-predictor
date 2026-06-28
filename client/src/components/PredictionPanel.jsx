import React, { useState } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, Legend
} from 'recharts';
import { BrainCircuit, TrendingUp, Shield, Cloud, Leaf } from 'lucide-react';

export const PredictionPanel = () => {
    const [payload, setPayload] = useState({ gdp: 1000, growth: 2.5, investment: 1.0, ch4: 85.0, agr: 15.0 });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        try {
            const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');
            const { data } = await axios.post(`${API_BASE}/api/predict`, payload);
            setResult(data);
        } catch (e) {
            console.error('Prediction failed:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='prediction-panel'>
            <div className='prediction-header'>
                <BrainCircuit size={24} style={{color: 'var(--accent-purple)'}} />
                <h2>Economic Impact Simulator</h2>
                <span className='badge-live'>ML-Powered</span>
            </div>

            <div className='slider-grid'>
                <div className='slider-group'>
                    <div className='slider-label'>
                        <span><TrendingUp size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} /> GDP Growth Rate (%)</span>
                        <span className='slider-value'>{payload.growth}%</span>
                    </div>
                    <input type='range' min='-2' max='8' step='0.1' value={payload.growth}
                        onChange={(e) => setPayload({...payload, growth: parseFloat(e.target.value)})} />
                </div>

                <div className='slider-group'>
                    <div className='slider-label'>
                        <span><Shield size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} /> Abatement Investment (% GDP)</span>
                        <span className='slider-value'>{payload.investment}%</span>
                    </div>
                    <input type='range' min='0' max='2' step='0.1' value={payload.investment}
                        onChange={(e) => setPayload({...payload, investment: parseFloat(e.target.value)})} />
                </div>

                <div className='slider-group'>
                    <div className='slider-label'>
                        <span><Cloud size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} /> Current CH₄ Emissions (Mt)</span>
                        <span className='slider-value'>{payload.ch4} Mt</span>
                    </div>
                    <input type='range' min='5' max='200' step='1' value={payload.ch4}
                        onChange={(e) => setPayload({...payload, ch4: parseFloat(e.target.value)})} />
                </div>

                <div className='slider-group'>
                    <div className='slider-label'>
                        <span><Leaf size={14} style={{marginRight: '6px', verticalAlign: 'middle'}} /> Agriculture (% of GDP)</span>
                        <span className='slider-value'>{payload.agr}%</span>
                    </div>
                    <input type='range' min='0' max='60' step='1' value={payload.agr}
                        onChange={(e) => setPayload({...payload, agr: parseFloat(e.target.value)})} />
                </div>
            </div>

            <button className='btn-predict' onClick={handlePredict} disabled={loading}>
                {loading ? 'Running Model...' : '⚡ Run 10-Year Simulation'}
            </button>

            {result && (
                <>
                    <div className='result-grid'>
                        <div className='result-card act'>
                            <h4>Act Now (30% Reduction)</h4>
                            <div className='result-value'>${result.act_now_loss.toFixed(1)}B</div>
                            <small>Total 10-Year Economic Damage</small>
                        </div>
                        <div className='result-card bau'>
                            <h4>Do Nothing (Business as Usual)</h4>
                            <div className='result-value'>${result.donot_act_loss.toFixed(1)}B</div>
                            <small>Total 10-Year Economic Damage</small>
                        </div>
                    </div>

                    <div className='hidden-tax-banner'>
                        <div className='tax-label'>The Hidden Tax of Inaction</div>
                        <div className='tax-value'>${result.hidden_tax.toFixed(1)}B</div>
                    </div>

                    {result.yearly && result.yearly.length > 0 && (
                        <div className='trajectory-section'>
                            <h3><TrendingUp size={18} /> 10-Year Damage Trajectory</h3>
                            <div className='trajectory-chart'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <AreaChart data={result.yearly}>
                                        <defs>
                                            <linearGradient id='gradBau' x1='0' y1='0' x2='0' y2='1'>
                                                <stop offset='5%' stopColor='var(--accent-rose)' stopOpacity={0.3} />
                                                <stop offset='95%' stopColor='var(--accent-rose)' stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id='gradAct' x1='0' y1='0' x2='0' y2='1'>
                                                <stop offset='5%' stopColor='var(--accent-emerald)' stopOpacity={0.3} />
                                                <stop offset='95%' stopColor='var(--accent-emerald)' stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray='3 3' stroke='var(--border-subtle)' />
                                        <XAxis dataKey='year' stroke='var(--text-muted)' tick={{fontSize: 12}} />
                                        <YAxis stroke='var(--text-muted)' tick={{fontSize: 12}}
                                            tickFormatter={(v) => `$${v}B`} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-light)',
                                                borderRadius: '8px',
                                                color: 'var(--text-primary)',
                                                fontSize: '0.85rem'
                                            }}
                                            formatter={(value, name) => [`$${Number(value).toFixed(1)}B`, name]}
                                        />
                                        <Area type='monotone' dataKey='loss_bau' stroke='var(--accent-rose)'
                                            fill='url(#gradBau)' strokeWidth={2.5} name='Business as Usual' />
                                        <Area type='monotone' dataKey='loss_act' stroke='var(--accent-emerald)'
                                            fill='url(#gradAct)' strokeWidth={2.5} name='Act Now' />
                                        <Legend />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
