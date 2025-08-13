import React, { useState, useEffect } from 'react';
import { contractService } from '../services/contract';

interface PriceData {
  timestamp: number;
  price: bigint;
}

const PriceChart: React.FC = () => {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCurrentPrice = async () => {
    try {
      const price = await contractService.getPricePerByte();
      setCurrentPrice(price);
      
      // 添加到历史记录
      setPriceHistory(prev => {
        const newHistory = [...prev, { timestamp: Date.now(), price }];
        // 只保留最近10个数据点
        return newHistory.slice(-10);
      });
    } catch (error) {
      console.error('获取价格失败:', error);
    }
  };

  useEffect(() => {
    fetchCurrentPrice();
    // 每60秒更新一次价格
    const interval = setInterval(fetchCurrentPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: bigint): string => {
    const wei = Number(price);
    if (wei >= 1e18) {
      return `${(wei / 1e18).toFixed(6)} DOT`;
    } else if (wei >= 1e12) {
      return `${(wei / 1e12).toFixed(3)} mDOT`;
    } else if (wei >= 1e9) {
      return `${(wei / 1e9).toFixed(3)} μDOT`;
    } else {
      return `${wei} wei`;
    }
  };

  const getPriceChange = (): { change: number; isPositive: boolean } => {
    if (priceHistory.length < 2) {
      return { change: 0, isPositive: true };
    }
    
    const current = Number(priceHistory[priceHistory.length - 1].price);
    const previous = Number(priceHistory[priceHistory.length - 2].price);
    const change = ((current - previous) / previous) * 100;
    
    return {
      change: Math.abs(change),
      isPositive: change >= 0
    };
  };

  const priceChange = getPriceChange();

  return (
    <div className="price-chart">
      <div className="price-header">
        <h3>💰 实时价格</h3>
        <button 
          className="refresh-price-btn"
          onClick={fetchCurrentPrice}
          disabled={loading}
        >
          🔄
        </button>
      </div>

      <div className="price-content">
        <div className="current-price">
          <div className="price-value">
            {currentPrice ? formatPrice(currentPrice) : '加载中...'}
          </div>
          <div className="price-label">每字节价格</div>
        </div>

        {priceHistory.length >= 2 && (
          <div className="price-change">
            <span className={`change-indicator ${priceChange.isPositive ? 'positive' : 'negative'}`}>
              {priceChange.isPositive ? '↗' : '↘'}
            </span>
            <span className={`change-value ${priceChange.isPositive ? 'positive' : 'negative'}`}>
              {priceChange.change.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {priceHistory.length > 1 && (
        <div className="price-trend">
          <div className="trend-label">价格趋势</div>
          <div className="trend-chart">
            {priceHistory.map((data, index) => {
              const maxPrice = Math.max(...priceHistory.map(d => Number(d.price)));
              const minPrice = Math.min(...priceHistory.map(d => Number(d.price)));
              const range = maxPrice - minPrice;
              const height = range > 0 ? ((Number(data.price) - minPrice) / range) * 100 : 50;
              
              return (
                <div 
                  key={data.timestamp}
                  className="trend-bar"
                  style={{ height: `${height}%` }}
                  title={`${formatPrice(data.price)} - ${new Date(data.timestamp).toLocaleTimeString()}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart; 