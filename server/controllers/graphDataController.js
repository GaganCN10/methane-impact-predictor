exports.getConcentration = (req, res) => {
    // Simulated NOAA Data (1983-2024)
    const data = [];
    for(let y=1983; y<=2024; y++) {
        data.push({ year: y, ch4_ppb: 1600 + ((y-1983) * 5) + (y>2014 ? (y-2014)*5 : 0) });
    }
    res.json(data);
};
exports.getSectoral = (req, res) => {
    const data = [ {year: 2000, Agriculture: 140, FossilFuels: 100, Waste: 60, Other: 20}, {year: 2022, Agriculture: 155, FossilFuels: 130, Waste: 80, Other: 25} ];
    res.json(data);
};
exports.getCountries = (req, res) => { res.json([{country: 'China', ch4: 80}, {country: 'USA', ch4: 65}, {country: 'Brazil', ch4: 45}]); };
exports.getLivestock = (req, res) => { res.json([{region: 'Asia', livestock_mt: 40, fossil_mt: 110}, {region: 'Americas', livestock_mt: 60, fossil_mt: 45}]); };
exports.getLosses = (req, res) => { res.json([{year: 2000, total_usd_bn: 100, insured_usd_bn: 30}, {year: 2023, total_usd_bn: 380, insured_usd_bn: 120}]); };
exports.getNDC = (req, res) => { res.json([{year: 2015, actual: 100, pledge: 100}, {year: 2022, actual: 115, pledge: 95}]); };
exports.getGDPScatter = (req, res) => { res.json([{country: 'USA', gdp: 25000, ch4_mt: 65, pop: 330, sector: 'Fossil'}, {country: 'Brazil', gdp: 1600, ch4_mt: 45, pop: 214, sector: 'Agriculture'}]); };

