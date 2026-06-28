# Methane's Hidden Tax

An academic-grade full-stack data visualization and Machine Learning predictions project. 
It analyzes the environmental trajectory of global Methane ($CH_4$) emissions and predicts the potential economic cost of inaction versus mitigation.

## Running the Application

To present this application, you must run both the Node.js API backend and the React frontend simultaneously in two separate terminal windows.

### 1. Start the Backend Server (Term 1)
The backend hosts the proxy data and executes the Python Machine Learning script (`predict.py`) using `python-shell` when you click "Predict" on the UI.

1. Open a new terminal.
2. Navigate to the server folder:
   ```bash
   cd server
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
   *(Or simply run `node index.js`)*
   
✅ **Expected Output:** `Server running on port 5000`

---

### 2. Start the Frontend React App (Term 2)
The frontend serves the user interface, interactive Recharts visualizations, and the ML parameters panel.

1. Open a **second** terminal.
2. Navigate to the client folder:
   ```bash
   cd client
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   
✅ **Expected Output:** Your browser will automatically open and compile to `http://localhost:3000`.

---

## Machine Learning Integration 
The prediction panel passes parameters from the React frontend to `server/index.js` via a POST request (`/api/predict`). The server then spins up a subprocess binding the local Python interpreter to run `server/ml/predict.py`. It pulls in `model.pkl` to render output directly back into the browser. 

*Ensure Python 3 is accessible within your command line environment variable paths (`python --version`) for the bridge to execute smoothly.*
