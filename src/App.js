import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockPricePage from './components/StockPricePage';
import CorrelationHeatmapPage from './components/CorrelationHeatmapPage';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Stock Prices</Link> | <Link to="/heatmap">Correlation Heatmap</Link>
      </nav>
      <Routes>
        <Route path="/" element={<StockPricePage />} />
        <Route path="/heatmap" element={<CorrelationHeatmapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
