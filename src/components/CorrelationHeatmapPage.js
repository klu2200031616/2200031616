import React, { useState, useEffect } from 'react';
import axios from 'axios';

function computePearson(x, y) {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b) / n;
  const meanY = y.reduce((a, b) => a + b) / n;

  const covariance = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0) / n;
  const stdDevX = Math.sqrt(x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) / n);
  const stdDevY = Math.sqrt(y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0) / n);

  return covariance / (stdDevX * stdDevY);
}

function CorrelationHeatmapPage() {
  const [tickers, setTickers] = useState([]);
  const [minutes, setMinutes] = useState(60);
  const [matrix, setMatrix] = useState([]);
  const [stocks, setStocks] = useState([]);

  const fetchAllData = async () => {
    const series = {};

    for (let ticker of tickers) {
      const response = await axios.get(`http://localhost:5000/stocks?ticker=${ticker}&minutes=${minutes}`);
      series[ticker] = response.data.map(p => p.price);
    }

    const mat = tickers.map((t1) =>
      tickers.map((t2) =>
        t1 === t2 ? 1 : computePearson(series[t1], series[t2]).toFixed(2)
      )
    );

    setMatrix(mat);
  };
  useEffect(() => {
    const fetchStocks = async () => {
      const response = await axios.get('http://localhost:5000/stocks');
      setStocks(response.data);
    };

    fetchStocks();
  }, []);

  return (
    <div>
      <h2>Correlation Heatmap</h2>

      <div>
        <label>Tickers : </label>
        <input
          type="text"
          value={tickers.join(',')}
          onChange={(e) =>
            setTickers(e.target.value.split(',').map(t => t.trim().toUpperCase()))
          }
        />
      </div>

      <div>
        <label>Minutes: </label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
      </div>

      <button onClick={fetchAllData}>Generate Heatmap</button>

      <h3>Available Stocks</h3>
      <ul>
        {stocks.map((stock, index) => (
          <li key={index}>{stock.ticker}: ${stock.price} - {stock.timestamp}</li>
        ))}
      </ul>

      <table border="1" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th></th>
            {tickers.map(t => (
              <th key={t}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td><b>{tickers[i]}</b></td>
              {row.map((val, j) => (
                <td key={j}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CorrelationHeatmapPage;
