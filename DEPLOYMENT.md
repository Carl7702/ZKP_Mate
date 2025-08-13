# 🚀 TimeLock 测试网部署指南

本指南将帮助你将 TimeLock 项目部署到测试网并实现钱包连接功能。

## 📋 前置要求

### 1. 环境准备
- Rust 1.70+
- Node.js 16+
- npm 或 yarn
- Polkadot.js 钱包扩展

### 2. 钱包准备
- 安装 [Polkadot.js 扩展](https://polkadot.js.org/extension/)
- 创建或导入账户
- 获取测试网代币

## 🌐 支持的测试网

### Shibuya 测试网 (推荐)
- **网络名称**: Shibuya
- **RPC 地址**: `wss://shibuya-rpc.dwellir.com`
- **浏览器**: https://shibuya.subscan.io
- **代币**: SBY (测试代币)
- **水龙头**: https://portal.astar.network/#/shibuya-faucet

### Rococo 测试网
- **网络名称**: Rococo
- **RPC 地址**: `wss://rococo-rpc.polkadot.io`
- **浏览器**: https://rococo.subscan.io
- **代币**: ROC (测试代币)

### Astar 主网
- **网络名称**: Astar
- **RPC 地址**: `wss://astar-rpc.dwellir.com`
- **浏览器**: https://astar.subscan.io
- **代币**: ASTR (真实代币)

## 🔧 部署步骤

### 1. 构建项目

```bash
# 构建智能合约
make build-contract

# 构建部署脚本
make build-scripts
```

### 2. 获取测试代币

#### Shibuya 测试网
1. 访问 https://portal.astar.network/#/shibuya-faucet
2. 连接你的钱包
3. 点击 "Request SBY" 获取测试代币

#### Rococo 测试网
1. 访问 https://matrix.to/#/#rococo-faucet:matrix.org
2. 在 Matrix 聊天中请求测试代币

### 3. 部署合约

```bash
# 部署到 Shibuya 测试网
cargo run --bin deploy_testnet shibuya contract/target/ink/stamping_contract.wasm

# 部署到 Rococo 测试网
cargo run --bin deploy_testnet rococo contract/target/ink/stamping_contract.wasm
```

### 4. 配置前端

部署完成后，脚本会自动生成前端配置文件 `frontend/src/config/contract.ts`。

你需要手动填入实际的合约地址：

```typescript
export const CONTRACT_CONFIG = {
  network: "Shibuya 测试网",
  contractAddress: "你的实际合约地址", // 替换这里
  rpcUrl: "wss://shibuya-rpc.dwellir.com",
  explorer: "https://shibuya.subscan.io"
};
```

### 5. 启动前端

```bash
# 启动前端开发服务器
make start-frontend
```

访问 http://localhost:3000 即可使用应用。

## 🔗 钱包连接

### 1. 安装 Polkadot.js 扩展

1. 访问 https://polkadot.js.org/extension/
2. 下载并安装浏览器扩展
3. 创建新账户或导入现有账户

### 2. 添加网络

#### Shibuya 测试网
- **网络名称**: Shibuya
- **RPC 地址**: `wss://shibuya-rpc.dwellir.com`
- **代币符号**: SBY
- **小数位数**: 18

#### Rococo 测试网
- **网络名称**: Rococo
- **RPC 地址**: `wss://rococo-rpc.polkadot.io`
- **代币符号**: ROC
- **小数位数**: 12

### 3. 连接钱包

1. 在应用中点击 "连接钱包" 按钮
2. 选择要连接的账户
3. 确认连接权限

## 🧪 测试功能

### 1. 文件上传测试
1. 上传一个测试文件
2. 查看生成的哈希值
3. 确认文件信息显示正确

### 2. 上链测试
1. 连接钱包
2. 点击 "上链" 按钮
3. 确认交易并等待完成
4. 查看交易结果

### 3. 验证测试
1. 使用哈希验证功能
2. 输入已上链的哈希值
3. 确认时间戳信息正确

## 🔍 故障排除

### 常见问题

#### 1. 网络连接失败
- 检查 RPC 地址是否正确
- 确认网络状态
- 尝试切换网络

#### 2. 钱包连接失败
- 确认已安装 Polkadot.js 扩展
- 检查账户是否已创建
- 确认网络配置正确

#### 3. 交易失败
- 检查账户余额是否充足
- 确认 gas 费用设置
- 查看错误信息

#### 4. 合约调用失败
- 确认合约地址正确
- 检查合约是否已部署
- 验证 ABI 配置

### 调试技巧

1. **查看浏览器控制台**
   - 打开开发者工具
   - 查看 Console 标签页
   - 关注错误信息

2. **检查网络请求**
   - 查看 Network 标签页
   - 确认 RPC 请求状态
   - 检查响应数据

3. **验证合约状态**
   - 使用区块链浏览器
   - 查看合约交易记录
   - 确认合约代码

## 📚 相关资源

- [Polkadot.js 文档](https://polkadot.js.org/docs/)
- [Ink! 智能合约文档](https://use.ink/)
- [Substrate 开发文档](https://docs.substrate.io/)
- [Astar 网络文档](https://docs.astar.network/)

## 🤝 获取帮助

如果遇到问题，可以：

1. 查看项目 Issues
2. 提交新的 Issue
3. 联系项目维护者

---

**祝部署顺利！** 🚀 