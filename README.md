# 🔒 TimeLock - 去中心化时间戳服务

TimeLock 是一个基于区块链的去中心化时间戳服务，利用区块链的不可篡改性为数字文件提供永久存在的时间证明。

## 🌟 项目特色

- **去中心化**: 基于区块链技术，无需信任第三方
- **不可篡改**: 利用区块链的不可篡改性保证时间戳的真实性
- **永久存在**: 一旦上链，时间戳将永久保存在区块链上
- **易于使用**: 简洁的前端界面，支持拖拽上传文件
- **开源透明**: 完全开源的智能合约和前端代码

## 🏗️ 项目架构

```
timelock/
├── contract/           # 智能合约 (Rust + Ink!)
│   ├── src/
│   │   └── lib.rs     # 合约主文件
│   └── Cargo.toml
├── frontend/          # 前端界面 (React + TypeScript)
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── services/      # 合约服务
│   │   ├── utils/         # 工具函数
│   │   └── App.tsx        # 主应用
│   └── package.json
├── scripts/           # 部署和测试脚本
│   ├── src/
│   │   └── main.rs    # 脚本主文件
│   └── Cargo.toml
└── Cargo.toml         # 工作空间配置
```

## 🚀 快速开始

### 环境要求

- Rust 1.70+
- Node.js 16+
- npm 或 yarn
- Substrate 开发环境

### 1. 克隆项目

```bash
git clone <repository-url>
cd timelock
```

### 2. 构建智能合约

```bash
# 进入合约目录
cd contract

# 构建合约
cargo build --release

# 生成合约元数据
cargo contract build
```

### 3. 启动前端

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 4. 部署合约

```bash
# 启动本地Substrate节点
substrate-contracts-node --dev

# 在另一个终端中部署合约
cd scripts
cargo run -- deploy --contract-path ../contract/target/ink/stamping_contract.wasm
```

## 📋 功能特性

### 智能合约功能

- **stamp_hash**: 为文件哈希值添加时间戳
- **get_timestamp**: 查询哈希值对应的时间戳
- **hash_exists**: 检查哈希值是否已存在
- **事件通知**: HashStamped 事件通知

### 前端功能

- **文件上传**: 支持拖拽上传，自动计算SHA-256哈希
- **哈希显示**: 显示文件信息和哈希值
- **上链操作**: 一键将哈希值上链
- **验证功能**: 验证哈希值是否已上链
- **状态显示**: 实时显示交易状态和结果

## 🔧 开发指南

### 智能合约开发

合约使用 Ink! 4.0 框架开发，主要文件：

```rust
// contract/src/lib.rs
#[ink::contract]
pub mod stamping_contract {
    #[ink(storage)]
    pub struct StampingContract {
        hash_timestamps: Mapping<[u8; 32], u64>,
        owner: AccountId,
    }
    
    // 实现合约方法...
}
```

### 前端开发

前端使用 React + TypeScript 开发，主要组件：

- `FileUpload`: 文件上传组件
- `HashDisplay`: 哈希值显示组件
- `HashVerifier`: 哈希值验证组件
- `ContractService`: 合约服务

### 测试

```bash
# 测试智能合约
cd contract
cargo test

# 测试脚本
cd scripts
cargo run -- test --contract-address <contract-address>

# 生成测试哈希
cargo run -- generate-hash --content "Hello, TimeLock!"
```

## 📖 API 文档

### 智能合约 API

#### stamp_hash
为文件哈希值添加时间戳

```rust
pub fn stamp_hash(&mut self, hash: [u8; 32]) -> Result<u64>
```

**参数:**
- `hash`: 32字节的文件哈希值

**返回值:**
- `Result<u64>`: 成功时返回时间戳，失败时返回错误

#### get_timestamp
查询哈希值对应的时间戳

```rust
pub fn get_timestamp(&self, hash: [u8; 32]) -> Option<u64>
```

**参数:**
- `hash`: 32字节的文件哈希值

**返回值:**
- `Option<u64>`: 如果找到则返回时间戳，否则返回None

### 前端 API

#### ContractService
合约服务类，提供与智能合约交互的方法

```typescript
class ContractService {
  async stampHash(hash: string): Promise<TransactionResult>
  async verifyHash(hash: string): Promise<VerificationResult>
  isConnected(): boolean
}
```

## 🛠️ 部署指南

### 本地开发环境

1. 安装 Substrate 开发环境
2. 启动本地节点
3. 部署智能合约
4. 配置前端连接

### 生产环境

1. 选择合适的 Substrate 网络
2. 部署智能合约到目标网络
3. 配置前端连接到生产网络
4. 设置域名和SSL证书

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Ink!](https://use.ink/) - 智能合约框架
- [Substrate](https://substrate.io/) - 区块链开发框架
- [Polkadot.js](https://polkadot.js.org/) - JavaScript API
- [React](https://reactjs.org/) - 前端框架


**TimeLock** - 为数字世界提供永恒的时间证明 ⏰ 