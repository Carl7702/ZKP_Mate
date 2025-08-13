# 🔗 从测试模式切换到真实区块链连接指南

## 📋 概述

当前应用运行在**测试模式**下，所有数据都是模拟的。要切换到真实的区块链连接，需要完成以下步骤：

## 🚀 步骤一：部署真实合约

### 1. 构建合约
```bash
cd contract
cargo contract build --release
```

### 2. 部署到测试网
```bash
# 部署到 Shibuya 测试网（推荐）
cargo run --bin deploy_testnet shibuya contract/target/ink/stamping_contract.wasm

# 或部署到 Rococo 测试网
cargo run --bin deploy_testnet rococo contract/target/ink/stamping_contract.wasm
```

部署成功后，您会得到：
- ✅ 合约地址（例如：`5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`）
- ✅ 合约ABI文件

## 🔧 步骤二：配置前端

### 1. 关闭测试模式

编辑 `frontend/src/services/contract.ts`：

```typescript
// 将测试模式设置为 false
const TEST_MODE = {
  enabled: false,  // 改为 false
  // ... 其他配置保持不变
};
```

### 2. 配置真实的合约ABI

将部署时生成的ABI替换占位符：

```typescript
// 替换这行：
const CONTRACT_ABI: any = {/* ... 需替换为编译产物的 ABI ... */};

// 改为真实的ABI（从 contract/target/ink/stamping_contract.json 获取）：
const CONTRACT_ABI = {
  "source": {
    "hash": "...",
    "language": "ink! 4.0.0",
    // ... 完整的ABI内容
  },
  "contract": {
    "name": "stamping_contract",
    "version": "0.1.0",
    // ... 合约信息
  },
  "spec": {
    // ... 合约规范
  }
};
```

### 3. 设置默认合约地址（可选）

如果您想要预设合约地址，可以修改：

```typescript
export class ContractService {
  // 在构造函数中设置默认合约地址
  constructor() {
    this.contractAddress = "您的真实合约地址";
    this.initialize();
  }
}
```

## 🌐 步骤三：准备钱包和测试代币

### 1. 安装Polkadot.js扩展
- 访问：https://polkadot.js.org/extension/
- 安装浏览器扩展
- 创建或导入账户

### 2. 获取测试代币

#### Shibuya测试网（推荐）
- 访问：https://portal.astar.network/#/shibuya-faucet
- 连接钱包获取SBY测试代币

#### Rococo测试网
- 访问：https://matrix.to/#/#rococo-faucet:matrix.org
- 在Matrix聊天中请求ROC测试代币

## 🔄 步骤四：测试真实连接

### 1. 重启前端应用
```bash
npm start
# 或
yarn start
```

### 2. 连接钱包
- 点击"连接钱包"按钮
- 选择您的账户
- 确认连接权限

### 3. 设置合约地址
- 进入"设置"页面
- 在"合约配置"中输入真实的合约地址
- 点击"测试连接"验证

### 4. 验证功能
- ✅ 右上角应显示"已连接"而不是"测试状态"
- ✅ 可以看到真实的账户余额
- ✅ 可以进行真实的上链操作
- ✅ 统计数据来自真实的区块链

## 🔍 故障排除

### 问题1：仍显示"测试状态"
**解决方案**：
- 确认 `TEST_MODE.enabled` 已设置为 `false`
- 清除浏览器缓存并重新加载

### 问题2：合约连接失败
**解决方案**：
- 验证合约地址格式正确
- 确认合约已成功部署到对应网络
- 检查ABI配置是否正确

### 问题3：钱包连接失败
**解决方案**：
- 确认已安装Polkadot.js扩展
- 检查账户是否有足够的测试代币
- 确认网络配置正确

### 问题4：交易失败
**解决方案**：
- 检查账户余额是否充足支付gas费
- 确认网络连接稳定
- 查看浏览器控制台的错误信息

## 📊 验证成功的标志

当配置正确后，您应该看到：

1. **连接状态**：右上角显示"✅ 已连接"
2. **真实余额**：显示您钱包中的实际代币余额
3. **网络信息**：显示连接的真实测试网络
4. **合约交互**：可以进行真实的上链和验证操作
5. **区块链数据**：统计面板显示来自区块链的真实数据

## 🎉 完成！

恭喜！您现在已经成功从测试模式切换到真实的区块链连接。用户可以：

- 🔗 连接真实的Polkadot钱包
- 💰 使用真实的测试代币
- 📝 将文件哈希真实地存储到区块链
- 🔍 验证存储在区块链上的数据
- 📊 查看真实的合约统计信息

---

**注意**：这是测试网环境，使用的是测试代币，没有真实价值。如果要部署到主网，需要使用真实代币并承担相应费用。
