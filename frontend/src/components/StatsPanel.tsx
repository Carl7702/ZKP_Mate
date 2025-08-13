import React, { useState, useEffect } from 'react';
import { contractService } from '../services/contract';
import { formatTimestamp } from '../utils/date';
import PriceChart from './PriceChart';
import DemoModeToggle from './DemoModeToggle';

interface StatsData {
  totalHashes: number;
  totalVolume: bigint;
  lastUpdated: number;
}

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState('normal');

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await contractService.getContractStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // 每30秒自动刷新一次
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatVolume = (volume: bigint): string => {
    const wei = Number(volume);
    if (wei >= 1e18) {
      return `${(wei / 1e18).toFixed(4)} DOT`;
    } else if (wei >= 1e12) {
      return `${(wei / 1e12).toFixed(2)} mDOT`;
    } else if (wei >= 1e9) {
      return `${(wei / 1e9).toFixed(2)} μDOT`;
    } else {
      return `${wei} wei`;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h2>📊 合约统计</h2>
        <button 
          className="refresh-btn"
          onClick={fetchStats}
          disabled={loading}
        >
          {loading ? '🔄' : '🔄'}
        </button>
      </div>

      {error && (
        <div className="stats-error">
          <p>❌ {error}</p>
        </div>
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔢</div>
            <div className="stat-content">
              <div className="stat-value">{formatNumber(stats.totalHashes)}</div>
              <div className="stat-label">总哈希值数量</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{formatVolume(stats.totalVolume)}</div>
              <div className="stat-label">总交易量</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <div className="stat-value">
                {stats.lastUpdated > 0 ? formatTimestamp(stats.lastUpdated) : '无数据'}
              </div>
              <div className="stat-label">最后更新</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🌐</div>
            <div className="stat-content">
              <div className="stat-value">{contractService.getCurrentNetwork().name}</div>
              <div className="stat-label">当前网络</div>
            </div>
          </div>
        </div>
      )}

      {/* 演示模式切换 */}
      <div className="demo-mode-section">
        <DemoModeToggle 
          onModeChange={setDemoMode}
          currentMode={demoMode}
        />
      </div>

      {/* 价格图表 */}
      <div className="price-chart-section">
        <PriceChart />
      </div>

      {loading && !stats && (
        <div className="stats-loading">
          <p>🔄 正在加载统计数据...</p>
        </div>
      )}
    </div>
  );
};

export default StatsPanel; 