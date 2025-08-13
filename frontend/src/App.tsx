import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import HashDisplay from './components/HashDisplay';
import HashVerifier from './components/HashVerifier';
import NetworkSelector from './components/NetworkSelector';
import WalletConnector from './components/WalletConnector';
import ContractConfig from './components/ContractConfig';
import StatsPanel from './components/StatsPanel';
import HistoryManager from './components/HistoryManager';
import Particles from './components/Particles';
import ErrorBoundary from './components/ErrorBoundary';
import { FileHash, TransactionResult, VerificationResult } from './types';
import { contractService } from './services/contract';
import './App.css';

type ActiveSection = 'upload' | 'verify' | 'stats' | 'history' | 'settings';

const App: React.FC = () => {
  const [currentFileHash, setCurrentFileHash] = useState<FileHash | null>(null);
  const [isStamping, setIsStamping] = useState(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [pricePerByte, setPricePerByte] = useState<bigint | undefined>(undefined);
  const [estimatedFee, setEstimatedFee] = useState<bigint | undefined>(undefined);
  const [currentNetwork, setCurrentNetwork] = useState(contractService.getCurrentNetwork());
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>('upload');

  useEffect(() => {
    let isMounted = true;
    
    const checkConnection = () => {
      try {
        if (isMounted) {
          const connected = contractService.isConnected();
          setIsConnected(connected);
        }
      } catch (error) {
        console.error('检查连接状态失败:', error);
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleNetworkChange = (networkKey: string) => {
    setCurrentNetwork(contractService.getCurrentNetwork());
    // 重置状态
    setCurrentFileHash(null);
    setTransactionResult(null);
    setPricePerByte(undefined);
    setEstimatedFee(undefined);
  };

  const handleWalletConnect = async (address: string) => {
    setWalletAddress(address);
    try {
      const price = await contractService.getPricePerByte();
      setPricePerByte(price);
      if (currentFileHash?.fileSize) {
        const fee = await contractService.estimateFee(currentFileHash.fileSize);
        setEstimatedFee(fee);
      }
    } catch (error) {
      console.error('获取价格失败:', error);
    }
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    setPricePerByte(undefined);
    setEstimatedFee(undefined);
  };

  const handleContractSet = (address: string) => {
    setContractAddress(address);
    console.log('合约地址已设置:', address);
  };

  const handleFileHash = async (fileHash: FileHash) => {
    setCurrentFileHash(fileHash);
    setTransactionResult(null);
    
    // 自动保存到历史记录
    const savedHistory = localStorage.getItem('timelock_history');
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    const newHistoryItem = {
      ...fileHash,
      timestamp: Date.now(),
    };
    const updatedHistory = [newHistoryItem, ...history.slice(0, 99)]; // 保留最近100条
    localStorage.setItem('timelock_history', JSON.stringify(updatedHistory));
    
    if (pricePerByte && fileHash.fileSize) {
      const fee = await contractService.estimateFee(fileHash.fileSize);
      setEstimatedFee(fee);
    }
  };

  const handleStampHash = async () => {
    if (!currentFileHash || !currentFileHash.fileSize) return;
    if (!walletAddress) {
      alert('请先连接钱包');
      return;
    }

    setIsStamping(true);
    setTransactionResult(null);

    try {
      const result = await contractService.stampHashPaid(currentFileHash.hash, currentFileHash.fileSize);
      setTransactionResult(result);
    } catch (error) {
      console.error('上链失败:', error);
      setTransactionResult({ status: 'error', error: error instanceof Error ? error.message : '未知错误' });
    } finally {
      setIsStamping(false);
    }
  };

  const handleVerifyHash = async (hash: string): Promise<VerificationResult> => {
    return await contractService.verifyHash(hash);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return (
          <div className="section-content">
            <section className="upload-section">
              <h2>📁 文件上传</h2>
              <FileUpload onFileHash={handleFileHash} />
            </section>

            {currentFileHash && (
              <section className="hash-section">
                <h2>🔍 哈希值信息</h2>
                <HashDisplay
                  fileHash={currentFileHash}
                  onStampHash={handleStampHash}
                  isStamping={isStamping}
                  walletAddress={walletAddress}
                  pricePerByte={pricePerByte}
                  estimatedFee={estimatedFee}
                  onConnectWallet={() => {}} // 现在通过WalletConnector处理
                />
              </section>
            )}

            {transactionResult && (
              <section className="transaction-section">
                <h2>📊 交易结果</h2>
                <div className={`transaction-result ${transactionResult.status}`}>
                  {transactionResult.status === 'success' ? (
                    <div>
                      <h3>✅ 上链成功！</h3>
                      <p><strong>交易哈希:</strong> {transactionResult.hash}</p>
                      {currentNetwork.explorer && (
                        <a 
                          href={`${currentNetwork.explorer}/extrinsic/${transactionResult.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="explorer-link"
                        >
                          🔍 在浏览器中查看
                        </a>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3>❌ 上链失败</h3>
                      <p><strong>错误信息:</strong> {transactionResult.error}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        );

      case 'verify':
        return (
          <div className="section-content">
            <section className="verify-section">
              <h2>🔍 验证哈希值</h2>
              <HashVerifier onVerifyHash={handleVerifyHash} />
            </section>
          </div>
        );

      case 'stats':
        return (
          <div className="section-content">
            <section className="stats-section">
              <StatsPanel />
            </section>
          </div>
        );

      case 'history':
        return (
          <div className="section-content">
            <section className="history-section">
              <HistoryManager />
            </section>
          </div>
        );

      case 'settings':
        return (
          <div className="section-content">
            {/* 网络选择和钱包连接区域 */}
            <ErrorBoundary fallback={
              <div className="error-fallback">
                <h3>⚠️ 网络设置加载失败</h3>
                <p>网络和钱包设置遇到问题，请刷新页面重试。</p>
              </div>
            }>
              <section className="connection-section">
                <h2>🌐 网络与钱包设置</h2>
                <div className="connection-grid">
                  <div className="network-selector-container">
                    <ErrorBoundary fallback={<div className="component-error">网络选择器加载失败</div>}>
                      <NetworkSelector onNetworkChange={handleNetworkChange} />
                    </ErrorBoundary>
                  </div>
                  <div className="wallet-connector-container">
                    <ErrorBoundary fallback={<div className="component-error">钱包连接器加载失败</div>}>
                      <WalletConnector 
                        onConnect={handleWalletConnect}
                        onDisconnect={handleWalletDisconnect}
                      />
                    </ErrorBoundary>
                  </div>
                </div>
              </section>
            </ErrorBoundary>

            {/* 合约配置区域 */}
            <ErrorBoundary fallback={
              <div className="error-fallback">
                <h3>⚠️ 合约配置加载失败</h3>
                <p>合约配置遇到问题，请刷新页面重试。</p>
              </div>
            }>
              <section className="contract-section">
                <ContractConfig onContractSet={handleContractSet} />
              </section>
            </ErrorBoundary>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Particles />
      
      {/* 固定顶部导航栏 */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h1>🔒 TimeLock</h1>
            <span className="navbar-subtitle">去中心化时间戳服务</span>
          </div>
          
          <div className="navbar-menu">
            <button 
              className={`nav-item ${activeSection === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveSection('upload')}
            >
              <span className="nav-icon">📁</span>
              <span className="nav-text">文件上传</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'verify' ? 'active' : ''}`}
              onClick={() => setActiveSection('verify')}
            >
              <span className="nav-icon">🔍</span>
              <span className="nav-text">验证哈希</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveSection('stats')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">统计面板</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'history' ? 'active' : ''}`}
              onClick={() => setActiveSection('history')}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-text">历史记录</span>
            </button>
            <button 
              className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">设置</span>
            </button>
          </div>

          <div className="navbar-status">
            <div className="status-card network-status">
              <div className="status-icon">🌐</div>
              <div className="status-content">
                <div className="status-label">网络</div>
                <div className="status-value">{currentNetwork.name}</div>
              </div>
            </div>
            <div className={`status-card connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              <div className="status-icon">
                {isConnected ? '🔗' : '🔌'}
              </div>
              <div className="status-content">
                <div className="status-label">连接状态</div>
                <div className="status-value">
                  {isConnected ? '已连接' : '未连接'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="App-main">
        <div className="container">
          {renderContent()}
        </div>
      </main>

      <footer className="App-footer">
        <p>© 2024 TimeLock - 基于区块链的去中心化时间戳服务</p>
        <p>利用区块链的不可篡改性，为数字文件提供永久存在的时间证明</p>
        <div className="footer-links">
          <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">
            📥 下载 Polkadot.js 钱包
          </a>
          <a href="https://shibuya.subscan.io" target="_blank" rel="noopener noreferrer">
            🔍 Shibuya 浏览器
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App; 