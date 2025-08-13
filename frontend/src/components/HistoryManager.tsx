import React, { useState, useEffect } from 'react';
import { FileHash, VerificationResult } from '../types';
import { contractService } from '../services/contract';

interface HistoryItem extends FileHash {
  timestamp: number;
  verified?: boolean;
  verificationResult?: VerificationResult;
}

const HistoryManager: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // 从localStorage加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('timelock_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
      } catch (error) {
        console.error('加载历史记录失败:', error);
      }
    }
  }, []);

  // 保存历史记录到localStorage
  const saveHistory = (newHistory: HistoryItem[]) => {
    localStorage.setItem('timelock_history', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // 添加新的历史记录
  const addHistoryItem = (fileHash: FileHash) => {
    const newItem: HistoryItem = {
      ...fileHash,
      timestamp: Date.now(),
    };
    const newHistory = [newItem, ...history.slice(0, 99)]; // 保留最近100条
    saveHistory(newHistory);
  };

  // 批量验证选中的哈希值
  const batchVerify = async () => {
    if (selectedItems.size === 0) return;

    setLoading(true);
    const newHistory = [...history];

    for (const hash of selectedItems) {
      const itemIndex = newHistory.findIndex(item => item.hash === hash);
      if (itemIndex !== -1) {
        try {
          const result = await contractService.verifyHash(hash);
          newHistory[itemIndex] = {
            ...newHistory[itemIndex],
            verified: true,
            verificationResult: result
          };
        } catch (error) {
          console.error(`验证哈希 ${hash} 失败:`, error);
        }
      }
    }

    saveHistory(newHistory);
    setSelectedItems(new Set());
    setLoading(false);
  };

  // 导出验证报告
  const exportReport = async () => {
    setExporting(true);
    
    const report = {
      exportTime: new Date().toISOString(),
      totalItems: history.length,
      verifiedItems: history.filter(item => item.verified).length,
      items: history.map(item => ({
        fileName: item.fileName,
        fileSize: item.fileSize,
        hash: item.hash,
        timestamp: new Date(item.timestamp).toISOString(),
        verified: item.verified,
        verificationResult: item.verificationResult
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timelock-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setExporting(false);
  };

  // 清空历史记录
  const clearHistory = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      localStorage.removeItem('timelock_history');
      setHistory([]);
      setSelectedItems(new Set());
    }
  };

  // 选择/取消选择项目
  const toggleSelection = (hash: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(hash)) {
      newSelected.delete(hash);
    } else {
      newSelected.add(hash);
    }
    setSelectedItems(newSelected);
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.size === history.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(history.map(item => item.hash)));
    }
  };

  return (
    <div className="history-manager">
      <div className="history-header">
        <h2>📋 历史记录管理</h2>
        <div className="history-actions">
          <button 
            className="action-btn verify-btn"
            onClick={batchVerify}
            disabled={loading || selectedItems.size === 0}
          >
            {loading ? '🔄 验证中...' : `🔍 批量验证 (${selectedItems.size})`}
          </button>
          <button 
            className="action-btn export-btn"
            onClick={exportReport}
            disabled={exporting || history.length === 0}
          >
            {exporting ? '📤 导出中...' : '📤 导出报告'}
          </button>
          <button 
            className="action-btn clear-btn"
            onClick={clearHistory}
            disabled={history.length === 0}
          >
            🗑️ 清空历史
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="empty-history">
          <p>📝 暂无历史记录</p>
          <p>上传文件后，记录将自动保存到这里</p>
        </div>
      ) : (
        <>
          <div className="history-controls">
            <label className="select-all-label">
              <input
                type="checkbox"
                checked={selectedItems.size === history.length && history.length > 0}
                onChange={toggleSelectAll}
              />
              <span>全选</span>
            </label>
            <span className="history-count">
              共 {history.length} 条记录，已选择 {selectedItems.size} 条
            </span>
          </div>

          <div className="history-list">
            {history.map((item, index) => (
              <div key={item.hash} className="history-item">
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.hash)}
                    onChange={() => toggleSelection(item.hash)}
                  />
                </div>
                
                <div className="item-content">
                  <div className="item-header">
                    <span className="item-name">{item.fileName}</span>
                    <span className="item-time">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="item-details">
                    <span className="item-size">{(item.fileSize / 1024).toFixed(2)} KB</span>
                    <span className="item-hash">{item.hash.slice(0, 16)}...</span>
                  </div>
                  
                  {item.verified && item.verificationResult && (
                    <div className={`verification-status ${item.verificationResult.exists ? 'exists' : 'not-exists'}`}>
                      {item.verificationResult.exists ? '✅ 已验证' : '❌ 未找到'}
                      {item.verificationResult.formattedDate && (
                        <span className="verification-date">
                          {item.verificationResult.formattedDate}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryManager; 