// 合约相关类型定义
export interface ContractConfig {
  address: string;
  abi: any;
}

// 文件哈希相关类型
export interface FileHash {
  hash: string;
  timestamp?: number;
  fileName?: string;
  fileSize?: number;
}

// 交易状态类型
export type TransactionStatus = 
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';

// 交易结果类型
export interface TransactionResult {
  status: TransactionStatus;
  hash?: string;
  error?: string;
  timestamp?: number;
}

// 验证结果类型
export interface VerificationResult {
  exists: boolean;
  timestamp?: number;
  formattedDate?: string;
} 