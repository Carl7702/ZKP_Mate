import React, { useState } from 'react';

interface DemoModeToggleProps {
  onModeChange: (mode: string) => void;
  currentMode: string;
}

const DemoModeToggle: React.FC<DemoModeToggleProps> = ({ onModeChange, currentMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const demoModes = [
    {
      id: 'normal',
      name: '正常模式',
      description: '模拟正常使用场景',
      icon: '📊'
    },
    {
      id: 'high-activity',
      name: '高活跃度',
      description: '模拟大量交易场景',
      icon: '🚀'
    },
    {
      id: 'low-activity',
      name: '低活跃度',
      description: '模拟较少交易场景',
      icon: '🐌'
    },
    {
      id: 'price-volatile',
      name: '价格波动',
      description: '模拟价格剧烈波动',
      icon: '📈'
    }
  ];

  const currentModeData = demoModes.find(mode => mode.id === currentMode) || demoModes[0];

  return (
    <div className="demo-mode-toggle">
      <div className="demo-header">
        <h3>🎭 演示模式</h3>
        <p>体验不同的数据场景</p>
      </div>
      
      <div className="mode-selector">
        <button 
          className="current-mode-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="mode-icon">{currentModeData.icon}</span>
          <span className="mode-name">{currentModeData.name}</span>
          <span className="mode-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>
        
        {isOpen && (
          <div className="mode-dropdown">
            {demoModes.map(mode => (
              <button
                key={mode.id}
                className={`mode-option ${mode.id === currentMode ? 'active' : ''}`}
                onClick={() => {
                  onModeChange(mode.id);
                  setIsOpen(false);
                }}
              >
                <span className="mode-icon">{mode.icon}</span>
                <div className="mode-info">
                  <span className="mode-name">{mode.name}</span>
                  <span className="mode-description">{mode.description}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="demo-info">
        <p>💡 当前模式：{currentModeData.description}</p>
        <p>🔄 数据每30秒自动更新</p>
      </div>
    </div>
  );
};

export default DemoModeToggle; 