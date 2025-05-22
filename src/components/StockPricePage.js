import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function StockPricePage() {
  const [ticker, setTicker] = useState('');
  const [minutes, setMinutes] = useState(60);
  const [data, setData] = useState([]);

  const fetchPrices = useCallback(async () => {
    try {
      const endpoint = ticker
        ? `http://localhost:5000/stocks?ticker=${ticker}`
        : `http://localhost:5000/stocks`;
      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching stock prices:', error);
    }
  }, [ticker]); 

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Stock Prices</h2>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px' }}>
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Ticker"
          style={{ padding: '10px', margin: '5px 0', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          placeholder="Minutes"
          style={{ padding: '10px', margin: '5px 0', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={fetchPrices} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '5px' }}>Get Prices</button>
        <button
          onClick={() => {
            setTicker('');
            fetchPrices();
          }}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '5px' }}
        >
          Show All Stocks
        </button>
      </div>

      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {data.length > 0 ? (
          data.map((item) => (
            <li key={item.id} style={{ backgroundColor: '#fff', padding: '10px', marginBottom: '5px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <pre>{JSON.stringify({
                ticker: item.ticker,
                price: item.price,
                lastUpdated: item.timestamp
              }, null, 2)}</pre>
            </li>
          ))
        ) : (
          <li>No data available.</li>
        )}
      </ul>
    </div>
  );
}

export default StockPricePage;
