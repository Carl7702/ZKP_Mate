import React, { useState, useEffect } from 'react';
import { contractService, NETWORKS } from '../services/contract';

interface NetworkSelectorProps {
  onNetworkChange?: (networkKey: string) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ onNetworkChange }) => {
  const [currentNetwork, setCurrentNetwork] = useState(contractService.getCurrentNetwork());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNetworkChange = async (networkKey: keyof typeof NETWORKS) => {
    if (isLoading) return; // 防止重复点击
    
    setIsLoading(true);
    try {
      await contractService.switchNetwork(networkKey);
      const newNetwork = NETWORKS[networkKey];
      setCurrentNetwork(newNetwork);
      onNetworkChange?.(networkKey);
      console.log(`✅ 已切换到 ${newNetwork.name}`);
    } catch (error) {
      console.error('❌ 网络切换失败:', error);
      // 使用更友好的错误提示，避免alert阻塞
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.error(`网络切换失败: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="network-selector">
      <h3>🌐 网络选择</h3>
      <div className="network-options">
        {Object.entries(NETWORKS).map(([key, network]) => (
          <button
            key={key}
            className={`network-option ${currentNetwork.name === network.name ? 'active' : ''}`}
            onClick={() => handleNetworkChange(key as keyof typeof NETWORKS)}
            disabled={isLoading}
          >
            <div className="network-info">
              <span className="network-name">{network.name}</span>
              {network.explorer && (
                <a 
                  href={network.explorer} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="network-explorer"
                  onClick={(e) => e.stopPropagation()}
                >
                  🔍 浏览器
                </a>
              )}
            </div>
            {currentNetwork.name === network.name && <span className="current-indicator">✅</span>}
          </button>
        ))}
      </div>
      {isLoading && <div className="loading">🔄 正在切换网络...</div>}
    </div>
  );
};

export default NetworkSelector; 