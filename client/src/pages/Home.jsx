import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { GraphCard } from '../components/GraphCard';
import { BarChart3, Globe, Zap, Activity } from 'lucide-react';

import graph5Img from '../assets/graph5_ch4_vs_temp.png';
import graph3Img from '../assets/graph3_top15_countries.png';

const TABS = [
    { id: 'overview', label: 'Overview & Trends', icon: Activity },
    { id: 'sources', label: 'Sector & Geography', icon: BarChart3 },
    { id: 'impact', label: 'Global Impact', icon: Globe },
];

/* Shared tooltip style */
const tooltipStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
};

export const Home = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [cData, setCData] = useState([]);
    const [sData, setSData] = useState([]);
    const [coData, setCoData] = useState([]);
    const [lData, setLData] = useState([]);
    const [loData, setLoData] = useState([]);
    const [nData, setNData] = useState([]);
    const [gData, setGData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');
                const [cRes, sRes, coRes, lRes, loRes, nRes, gRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/data/concentration`),
                    axios.get(`${API_BASE}/api/data/sectoral`),
                    axios.get(`${API_BASE}/api/data/countries`),
                    axios.get(`${API_BASE}/api/data/livestock`),
                    axios.get(`${API_BASE}/api/data/losses`),
                    axios.get(`${API_BASE}/api/data/ndc`),
                    axios.get(`${API_BASE}/api/data/gdp-scatter`)
                ]);
                setCData(cRes.data);
                setSData(sRes.data);
                setCoData(coRes.data);
                setLData(lRes.data);
                setLoData(loRes.data);
                setNData(nRes.data);
                setGData(gRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='dashboard-container'>
            {/* Tab Navigation */}
            <nav className='tab-nav'>
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            {/* ─── OVERVIEW TAB ─── */}
            {activeTab === 'overview' && (
                <div className='tab-content'>
                    {cData.length > 0 && (
                        <GraphCard
                            title='Rising Atmospheric Methane Concentration (1983–2024)'
                            source='NOAA Global Monitoring Laboratory'
                            insights={[
                                'Crossed 1,800 ppb for the first time in 2008 — highest in 800,000 years.',
                                'Accelerated drastically post-2014, rising ~10 ppb/year currently.',
                                'Methane has grown relatively faster than any other major greenhouse gas.'
                            ]}
                        >
                            <ResponsiveContainer width='100%' height='100%'>
                                <AreaChart data={cData}>
                                    <defs>
                                        <linearGradient id='colorCH4' x1='0' y1='0' x2='0' y2='1'>
                                            <stop offset='5%' stopColor='var(--chart-1)' stopOpacity={0.4} />
                                            <stop offset='95%' stopColor='var(--chart-1)' stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray='3 3' stroke='var(--border-subtle)' />
                                    <XAxis dataKey='year' stroke='var(--text-muted)' tick={{ fontSize: 12 }} />
                                    <YAxis domain={['auto', 'auto']} stroke='var(--text-muted)' tick={{ fontSize: 12 }}
                                        tickFormatter={(v) => `${v}`} />
                                    <Tooltip contentStyle={tooltipStyle}
                                        formatter={(v) => [`${v} ppb`, 'CH₄ Concentration']} />
                                    <Area type='monotone' dataKey='ch4_ppb' stroke='var(--chart-1)'
                                        fillOpacity={1} fill='url(#colorCH4)' strokeWidth={2.5}
                                        name='CH₄ (ppb)' />
                                </AreaChart>
                            </ResponsiveContainer>
                        </GraphCard>
                    )}

                    {sData.length > 0 && (
                        <GraphCard
                            title='Sectoral Methane Emissions Over Time (2000–2022)'
                            source='EDGAR v8.0 Greenhouse Gas Emissions'
                            insights={[
                                'Agriculture consistently contributes ~40% of global methane — making it the single largest sectoral source.',
                                'Fossil fuel methane emissions dropped sharply during 2020 and rebounded within 18 months.',
                                'Waste sector emissions have grown monotonically since 2000 with no visible inflection.'
                            ]}
                        >
                            <ResponsiveContainer width='100%' height='100%'>
                                <AreaChart data={sData}>
                                    <CartesianGrid strokeDasharray='3 3' stroke='var(--border-subtle)' />
                                    <XAxis dataKey='year' stroke='var(--text-muted)' tick={{ fontSize: 12 }} />
                                    <YAxis stroke='var(--text-muted)' tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend />
                                    <Area type='monotone' dataKey='Agriculture' stackId='1'
                                        stroke='var(--chart-2)' fill='var(--chart-2)' fillOpacity={0.6} />
                                    <Area type='monotone' dataKey='FossilFuels' stackId='1'
                                        stroke='var(--chart-4)' fill='var(--chart-4)' fillOpacity={0.6} />
                                    <Area type='monotone' dataKey='Waste' stackId='1'
                                        stroke='var(--chart-3)' fill='var(--chart-3)' fillOpacity={0.6} />
                                    <Area type='monotone' dataKey='Other' stackId='1'
                                        stroke='var(--chart-6)' fill='var(--chart-6)' fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </GraphCard>
                    )}
                </div>
            )}

            {/* ─── SOURCES TAB ─── */}
            {activeTab === 'sources' && (
                <div className='tab-content'>
                    {coData.length > 0 && (
                        <GraphCard
                            title='Top Methane Emitting Countries'
                            source='EDGAR v8.0 Country-level GHG emissions'
                            insights={[
                                'China and the US are top-3 emitters but for structurally opposite reasons (coal vs natural gas/livestock).',
                                'Brazil ranks in the top 5 globally driven almost entirely by livestock.',
                                'Russia footprint is almost entirely from fossil fuel extraction and pipeline leakage.'
                            ]}
                        >
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart data={coData} layout='vertical'>
                                    <CartesianGrid strokeDasharray='3 3' stroke='var(--border-subtle)' />
                                    <XAxis type='number' stroke='var(--text-muted)' tick={{ fontSize: 12 }} />
                                    <YAxis dataKey='country' type='category' stroke='var(--text-muted)' tick={{ fontSize: 12 }} width={80} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Bar dataKey='ch4' fill='var(--chart-1)' name='Methane (Mt)' radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </GraphCard>
                    )}

                    {lData.length > 0 && (
                        <GraphCard
                            title='Livestock vs. Fossil Fuel Methane by Region'
                            source='FAOSTAT + EDGAR v8.0'
                            insights={[
                                'In Asia, fossil fuel methane dwarfs livestock methane by a factor of nearly 3:1.',
                                'Africa produces relatively low absolute methane volumes but its emission profile is almost entirely livestock-based.',
                                'Oceania has the highest per-capita livestock methane in the world.'
                            ]}
                        >
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart data={lData}>
                                    <CartesianGrid strokeDasharray='3 3' stroke='var(--border-subtle)' />
                                    <XAxis dataKey='region' stroke='var(--text-muted)' tick={{ fontSize: 12 }} />
                                    <YAxis stroke='var(--text-muted)' tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend />
                                    <Bar dataKey='livestock_mt' fill='var(--chart-2)' name='Livestock' radius={[6, 6, 0, 0]} />
                                    <Bar dataKey='fossil_mt' fill='var(--chart-4)' name='Fossil Fuels' radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </GraphCard>
                    )}

                    {gData.length > 0 && (
                        <GraphCard
                            title='Top 15 Methane Emitting Countries'
                            source='EDGAR v8.0 Country-level GHG emissions'
                            insights={[
                                'China and the United States lead global emissions, but with entirely different sectoral profiles (coal vs natural gas & livestock).',
                                'Brazil and India follow closely, driven primarily by their massive agricultural and livestock sectors.',
                                'The top 15 countries account for the vast majority of global methane, meaning targeted policy here has outsized global impacts.'
                            ]}
                        >
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={graph3Img} alt="Top 15 Methane Emitting Countries"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                            </div>
                        </GraphCard>
                    )}
                </div>
            )}

            {/* ─── IMPACT TAB ─── */}
            {activeTab === 'impact' && (
                <div className='tab-content'>
                    {loData.length > 0 && (
                        <GraphCard
                            title='Atmospheric Methane vs Global Temperature Anomaly'
                            source='NOAA Global Surface Temperature Data & GML'
                            insights={[
                                'There is a strong positive correlation between rising methane concentrations and spikes in global temperature anomalies.',
                                "Methane's short atmospheric lifespan but high warming potential makes its impact on near-term temperatures highly pronounced.",
                                'Recent temperature spikes closely follow the post-2014 acceleration in atmospheric methane levels.'
                            ]}
                        >
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src={graph5Img} alt="CH4 vs Temperature Anomaly"
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                            </div>
                        </GraphCard>
                    )}

                    {nData.length > 0 && (
                        <GraphCard
                            title='NDC Pledge vs. Actual Methane Trajectory'
                            source='EDGAR v8.0 (actual) + Climate Watch NDC data (pledged)'
                            insights={[
                                'Methane emissions track 15–20% above the trajectory required to meet NDC pledges.',
                                'Only the EU shows a methane emission trajectory consistent with its stated NDC pathway.',
                                'The Global Methane Pledge (2021) has produced zero measurable inflection in the emission record.'
                            ]}
                        >
                            <ResponsiveContainer width='100%' height='100%'>
                                <LineChart data={nData}>
                                    <CartesianGrid strokeDasharray='3 3' stroke='var(--border-subtle)' />
                                    <XAxis dataKey='year' stroke='var(--text-muted)' tick={{ fontSize: 12 }} />
                                    <YAxis stroke='var(--text-muted)' tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend />
                                    <Line type='monotone' dataKey='actual' stroke='var(--accent-rose)'
                                        strokeWidth={3} name='Actual Emissions' dot={false} />
                                    <Line type='monotone' dataKey='pledge' stroke='var(--text-secondary)'
                                        strokeWidth={3} strokeDasharray='8 4' name='NDC Target' dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </GraphCard>
                    )}
                </div>
            )}
        </div>
    );
};
