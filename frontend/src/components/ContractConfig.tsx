import React, { useState, useEffect } from 'react';
import { contractService } from '../services/contract';

interface ContractConfigProps {
  onContractSet?: (address: string) => void;
}

const ContractConfig: React.FC<ContractConfigProps> = ({ onContractSet }) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [isContractSet, setIsContractSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    try {
      // 从localStorage加载保存的合约地址
      const savedAddress = localStorage.getItem('timelock_contract_address');
      if (savedAddress && isMounted) {
        setContractAddress(savedAddress);
        contractService.setContractAddress(savedAddress);
        setIsContractSet(true);
      }
    } catch (error) {
      console.error('加载保存的合约地址失败:', error);
      if (isMounted) {
        setError('加载保存的配置失败');
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSetContract = async () => {
    if (!contractAddress.trim()) {
      setError('请输入合约地址');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 验证地址格式（更宽松的检查）
      if (contractAddress.length < 20) {
        throw new Error('合约地址格式不正确');
      }

      // 设置合约地址
      contractService.setContractAddress(contractAddress);
      
      // 保存到localStorage
      localStorage.setItem('timelock_contract_address', contractAddress);
      
      setIsContractSet(true);
      onContractSet?.(contractAddress);
      
      console.log('✅ 合约地址设置成功:', contractAddress);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '设置失败';
      setError(errorMessage);
      console.error('❌ 设置合约地址失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearContract = () => {
    setContractAddress('');
    setIsContractSet(false);
    localStorage.removeItem('timelock_contract_address');
    console.log('🗑️ 合约地址已清除');
  };

  const handleTestConnection = async () => {
    if (!isContractSet) {
      setError('请先设置合约地址');
      return;
    }

    if (isLoading) return; // 防止重复点击

    setIsLoading(true);
    setError(null);

    try {
      // 测试合约连接
      const price = await contractService.getPricePerByte();
      console.log('✅ 合约连接测试成功，价格:', price);
      
      // 检查是否为演示模式
      const isDemo = !contractService.isConnected() && contractService.getActiveAddress();
      const modeText = isDemo ? '（演示模式）' : '';
      
      setError(`✅ 合约连接成功！${modeText}当前价格: ${price} wei/byte`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '连接失败';
      
      // 如果是"合约未初始化"错误，提供更友好的提示
      if (errorMessage.includes('合约未初始化')) {
        setError(`⚠️ 进入演示模式：合约地址已保存，但无法连接到真实合约。您仍可以使用文件哈希等核心功能。`);
      } else {
        setError(`合约连接失败: ${errorMessage}`);
      }
      
      console.error('❌ 合约连接测试失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contract-config">
      <h3>📄 合约配置</h3>
      
      {!isContractSet ? (
        <div className="contract-setup">
          <p>请设置已部署的合约地址以使用完整功能</p>
          
          <div className="input-group">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="输入合约地址 (例如: 0x1234...)"
              className="contract-input"
            />
            <button
              onClick={handleSetContract}
              disabled={isLoading || !contractAddress.trim()}
              className="set-contract-button"
            >
              {isLoading ? '🔄 设置中...' : '🔗 设置合约'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="contract-help">
            <h4>💡 如何获取合约地址？</h4>
            <ol>
              <li>部署合约到测试网</li>
              <li>从部署结果中复制合约地址</li>
              <li>粘贴到上方输入框</li>
              <li>点击"设置合约"按钮</li>
            </ol>
            <p>
              <strong>🧪 测试模式:</strong> 当前已启用测试模式，无需设置真实合约地址即可体验功能
            </p>
            <button
              onClick={() => {
                setContractAddress('0x1234567890123456789012345678901234567890');
                handleSetContract();
              }}
              className="test-mode-button"
            >
              🧪 启用测试模式
            </button>
          </div>
        </div>
      ) : (
        <div className="contract-info">
          <div className="contract-address">
            <strong>合约地址:</strong> 
            <span className="address">{contractAddress}</span>
            <button
              onClick={() => navigator.clipboard.writeText(contractAddress)}
              className="copy-button"
              title="复制地址"
            >
              📋
            </button>
          </div>
          
          <div className="contract-actions">
            <button
              onClick={handleTestConnection}
              disabled={isLoading}
              className="test-button"
            >
              {isLoading ? '🔄 测试中...' : '🧪 测试连接'}
            </button>
            
            <button
              onClick={handleClearContract}
              className="clear-button"
            >
              🗑️ 清除配置
            </button>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractConfig; 