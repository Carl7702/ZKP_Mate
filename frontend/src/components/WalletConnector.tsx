import React, { useState, useEffect } from 'react';
import { contractService } from '../services/contract';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface WalletConnectorProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({ onConnect, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const checkConnectionSafe = async () => {
      try {
        const address = contractService.getActiveAddress();
        if (address && isMounted) {
          setIsConnected(true);
          setWalletAddress(address);
          await updateBalance(address);
          await updateAccounts();
        }
      } catch (error) {
        if (isMounted) {
          console.error('检查连接状态失败:', error);
          setError(error instanceof Error ? error.message : '连接检查失败');
        }
      }
    };
    
    checkConnectionSafe();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const checkConnection = async () => {
    const address = contractService.getActiveAddress();
    if (address) {
      setIsConnected(true);
      setWalletAddress(address);
      await updateBalance(address);
      await updateAccounts();
    }
  };

  const updateBalance = async (address: string) => {
    try {
      const balance = await contractService.getBalance(address);
      setBalance(balance);
    } catch (error) {
      console.error('获取余额失败:', error);
      setBalance(null);
    }
  };

  const updateAccounts = async () => {
    try {
      const accounts = contractService.getAccounts();
      setAccounts(accounts);
      const currentAddress = contractService.getActiveAddress();
      const currentAccount = accounts.find(acc => acc.address === currentAddress);
      setSelectedAccount(currentAccount || null);
    } catch (error) {
      console.error('获取账户列表失败:', error);
      setAccounts([]);
      setSelectedAccount(null);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const address = await contractService.connectWallet();
      setIsConnected(true);
      setWalletAddress(address);
      await updateBalance(address);
      await updateAccounts();
      onConnect?.(address);
      console.log('✅ 钱包连接成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '连接失败';
      setError(errorMessage);
      console.error('❌ 钱包连接失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(null);
    setAccounts([]);
    setSelectedAccount(null);
    onDisconnect?.();
    console.log('🔌 钱包已断开连接');
  };

  const switchAccount = async (account: InjectedAccountWithMeta) => {
    try {
      // 重新连接钱包以切换账户
      await contractService.connectWallet();
      setSelectedAccount(account);
      setWalletAddress(account.address);
      await updateBalance(account.address);
      onConnect?.(account.address);
    } catch (error) {
      console.error('切换账户失败:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const balanceNum = parseFloat(balance) / 1e18; // 假设18位小数
    return balanceNum.toFixed(4);
  };

  if (!isConnected) {
    return (
      <div className="wallet-connector">
        <div className="wallet-status disconnected">
          <h3>🔌 连接钱包</h3>
          <p>请连接您的 Polkadot.js 钱包以使用 TimeLock 服务</p>
          
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
          
          <button 
            className="connect-button"
            onClick={connectWallet}
            disabled={isLoading}
          >
            {isLoading ? '🔄 连接中...' : '🔗 连接钱包'}
          </button>
          
          <div className="wallet-instructions">
            <h4>📋 使用说明：</h4>
            <ol>
              <li>安装 <a href="https://polkadot.js.org/extension/" target="_blank" rel="noopener noreferrer">Polkadot.js 扩展</a></li>
              <li>创建或导入账户</li>
              <li>确保账户中有足够的代币余额</li>
              <li>点击上方按钮连接钱包</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connector">
      <div className="wallet-status connected">
        <h3>✅ 钱包已连接</h3>
        
        <div className="account-info">
          <div className="account-address">
            <strong>地址:</strong> {walletAddress && formatAddress(walletAddress)}
            <button 
              className="copy-button"
              onClick={() => walletAddress && navigator.clipboard.writeText(walletAddress)}
              title="复制地址"
            >
              📋
            </button>
          </div>
          
          {balance && (
            <div className="account-balance">
              <strong>余额:</strong> {formatBalance(balance)} SBY
            </div>
          )}
        </div>

        {accounts.length > 1 && (
          <div className="account-selector">
            <h4>选择账户:</h4>
            <select 
              value={selectedAccount?.address || ''}
              onChange={(e) => {
                const account = accounts.find(acc => acc.address === e.target.value);
                if (account) switchAccount(account);
              }}
            >
              {accounts.map((account) => (
                <option key={account.address} value={account.address}>
                  {account.meta.name || formatAddress(account.address)}
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          className="disconnect-button"
          onClick={disconnectWallet}
        >
          🔌 断开连接
        </button>
      </div>
    </div>
  );
};

export default WalletConnector; 