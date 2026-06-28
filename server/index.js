const express = require('express');
const cors = require('cors');
const graphRoutes = require('./routes/graphRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/data', graphRoutes);

const { PythonShell } = require('python-shell');

// Pure Javascript fallback calculation of server/ml/predict.py
function calculatePredictions(ch4, gdp, growth, agr, investment, years = 10) {
    const LOSS_PER_MT_USD_BN = 2.1;
    const HISTORICAL_CH4_GROWTH = 0.009;
    const GLOBAL_PLEDGE_REDUCTION = 0.30;
    
    const ACT_NOW_RATE = -(GLOBAL_PLEDGE_REDUCTION / years);
    const results = [];
    let ch4_bau = ch4;
    let ch4_act = ch4;
    let gdp_current = gdp;

    for (let yr = 1; yr <= years; yr++) {
        gdp_current *= (1 + growth / 100);
        ch4_bau *= (1 + HISTORICAL_CH4_GROWTH);
        ch4_act *= (1 + ACT_NOW_RATE);
        
        const loss_bau = ch4_bau * LOSS_PER_MT_USD_BN;
        const abatement_cost = (investment / 100) * gdp_current;
        const loss_act = ch4_act * LOSS_PER_MT_USD_BN + abatement_cost;
        
        results.push({
            year: 2024 + yr,
            ch4_bau: Number(ch4_bau.toFixed(3)),
            ch4_act: Number(ch4_act.toFixed(3)),
            loss_bau: Number(loss_bau.toFixed(2)),
            loss_act: Number(loss_act.toFixed(2)),
            hidden_tax: Number((loss_bau - loss_act).toFixed(2))
        });
    }

    const total_bau = results.reduce((sum, r) => sum + r.loss_bau, 0);
    const total_act = results.reduce((sum, r) => sum + r.loss_act, 0);

    return {
        yearly: results,
        total_loss_bau: Number(total_bau.toFixed(1)),
        total_loss_act: Number(total_act.toFixed(1)),
        total_hidden_tax: Number((total_bau - total_act).toFixed(1)),
        ch4_final_bau: Number(results[results.length - 1].ch4_bau.toFixed(3)),
        ch4_final_act: Number(results[results.length - 1].ch4_act.toFixed(3))
    };
}

app.post('/api/predict', (req, res) => {
    const { gdp, growth, investment, ch4, agr } = req.body;
    
    const ch4_val = ch4 !== undefined ? Number(ch4) : 85.0;
    const gdp_val = gdp !== undefined ? Number(gdp) : 1000.0;
    const growth_val = growth !== undefined ? Number(growth) : 2.5;
    const agr_val = agr !== undefined ? Number(agr) : 10.0;
    const investment_val = investment !== undefined ? Number(investment) : 1.0;

    let options = {
        mode: 'json',
        pythonPath: 'python', // Use active python env
        scriptPath: './ml/',
        args: [
            ch4_val,
            gdp_val,
            growth_val,
            agr_val,
            investment_val
        ]
    };

    PythonShell.run('predict.py', options).then(messages => {
        res.json({
            act_now_loss: messages[0].total_loss_act,
            donot_act_loss: messages[0].total_loss_bau,
            hidden_tax: messages[0].total_hidden_tax,
            yearly: messages[0].yearly || []
        });
    }).catch(err => {
        console.warn("Python shell prediction failed, falling back to JS implementation:", err.message);
        try {
            const prediction = calculatePredictions(ch4_val, gdp_val, growth_val, agr_val, investment_val);
            res.json({
                act_now_loss: prediction.total_loss_act,
                donot_act_loss: prediction.total_loss_bau,
                hidden_tax: prediction.total_hidden_tax,
                yearly: prediction.yearly || []
            });
        } catch (jsErr) {
            console.error("JS prediction fallback failed:", jsErr);
            res.status(500).json({ error: "Failed to execute prediction model" });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));

