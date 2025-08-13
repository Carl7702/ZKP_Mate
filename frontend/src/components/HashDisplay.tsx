import React from 'react';
import { FileHash } from '../types';
import { formatFileSize } from '../utils/crypto';

interface HashDisplayProps {
  fileHash: FileHash;
  onStampHash: () => void;
  isStamping: boolean;
  walletAddress?: string | null;
  estimatedFee?: bigint;
  pricePerByte?: bigint;
  onConnectWallet?: () => Promise<void> | void;
}

const HashDisplay: React.FC<HashDisplayProps> = ({ 
  fileHash, 
  onStampHash, 
  isStamping,
  walletAddress,
  estimatedFee,
  pricePerByte,
  onConnectWallet,
}) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fileHash.hash);
      alert('哈希值已复制到剪贴板');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制');
    }
  };

  return (
    <div className="hash-display">
      <div className="file-info">
        <h3>文件信息</h3>
        {fileHash.fileName && (
          <p><strong>文件名:</strong> {fileHash.fileName}</p>
        )}
        {typeof fileHash.fileSize === 'number' && (
          <p><strong>文件大小:</strong> {formatFileSize(fileHash.fileSize)}</p>
        )}
      </div>
      
      <div className="hash-info">
        <h3>SHA-256 哈希值</h3>
        <div className="hash-container">
          <code className="hash-value">{fileHash.hash}</code>
          <button 
            className="copy-button" 
            onClick={copyToClipboard}
            title="复制哈希值"
          >
            📋
          </button>
        </div>
      </div>

      <div className="file-info">
        <h3>费用信息</h3>
        <p><strong>钱包地址:</strong> {walletAddress ?? '未连接'}</p>
        {typeof pricePerByte === 'bigint' && (
          <p><strong>单字节价格:</strong> {pricePerByte.toString()}</p>
        )}
        {typeof estimatedFee === 'bigint' && (
          <p><strong>预计费用:</strong> {estimatedFee.toString()}</p>
        )}
        {!walletAddress && (
          <button className="upload-button" type="button" onClick={() => onConnectWallet && onConnectWallet()}>
            连接钱包
          </button>
        )}
      </div>
      
      <div className="action-buttons">
        <button
          className={`stamp-button ${isStamping ? 'loading' : ''}`}
          onClick={onStampHash}
          disabled={isStamping || !walletAddress}
        >
          {isStamping ? '正在上链...' : '付费上链时间戳'}
        </button>
      </div>
    </div>
  );
};

export default HashDisplay; 