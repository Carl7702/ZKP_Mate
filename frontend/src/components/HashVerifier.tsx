import React, { useState } from 'react';
import { VerificationResult } from '../types';
import { getRelativeTime } from '../utils/date';
import { formatTimestamp } from '../utils/date';

interface HashVerifierProps {
  onVerifyHash: (hash: string) => Promise<VerificationResult>;
}

const HashVerifier: React.FC<HashVerifierProps> = ({ onVerifyHash }) => {
  const [hashInput, setHashInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!hashInput.trim()) {
      alert('请输入哈希值');
      return;
    }

    // 验证哈希值格式（64位十六进制字符）
    const hashRegex = /^[a-fA-F0-9]{64}$/;
    if (!hashRegex.test(hashInput.trim())) {
      alert('请输入有效的SHA-256哈希值（64位十六进制字符）');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await onVerifyHash(hashInput.trim());
      setVerificationResult(result);
    } catch (error) {
      console.error('验证失败:', error);
      alert('验证失败，请重试');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHashInput(event.target.value);
    // 清除之前的结果
    if (verificationResult) {
      setVerificationResult(null);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className="hash-verifier">
      <div className="verifier-input">
        <input
          type="text"
          value={hashInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="请输入64位SHA-256哈希值"
          className="hash-input"
          disabled={isVerifying}
        />
        <button
          className={`verify-button ${isVerifying ? 'loading' : ''}`}
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? '验证中...' : '验证哈希'}
        </button>
      </div>

      {verificationResult && (
        <div className={`verification-result ${verificationResult.exists ? 'exists' : 'not-exists'}`}>
          {verificationResult.exists ? (
            <div className="result-success">
              <h4>✅ 哈希值已上链</h4>
              <div className="timestamp-info">
                <p><strong>📅 上链时间:</strong> {verificationResult.formattedDate}</p>
                <p><strong>⏰ 相对时间:</strong> {getRelativeTime(verificationResult.timestamp)}</p>
                <p className="timestamp-note">
                  <small>💡 这是文件在区块链上记录的确切时间，证明文件在此时间点已存在</small>
                </p>
              </div>
            </div>
          ) : (
            <div className="result-not-found">
              <h4>❌ 哈希值未找到</h4>
              <p>该哈希值尚未在区块链上记录时间戳</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HashVerifier; 