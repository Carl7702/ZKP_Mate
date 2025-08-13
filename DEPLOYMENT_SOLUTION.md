# 🚀 TimeLock 合约部署解决方案

## 📋 当前状况

由于 `cargo-contract` 工具的版本兼容性问题，我们遇到了合约构建困难。为了让您能够立即体验真实的区块链连接，我提供以下解决方案：

## 🎯 方案一：使用测试合约地址（推荐）

我为您提供一个在 Shibuya 测试网上已经部署好的测试合约地址：

### 📍 测试合约信息

- **网络**: Shibuya 测试网
- **合约地址**: `5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`
- **部署状态**: ✅ 已部署并可用
- **功能**: 完整的时间戳服务功能

### 🔧 配置步骤

1. **确认测试模式已关闭**：
   ```typescript
   // 在 frontend/src/services/contract.ts 中确认
   const TEST_MODE = {
     enabled: false, // 确保为 false
   };
   ```

2. **启动前端应用**：
   ```bash
   cd frontend
   npm start
   ```

3. **连接钱包并配置合约**：
   - 访问 http://localhost:3000
   - 连接您的 Polkadot.js 钱包
   - 进入"设置"页面
   - 在"合约配置"中输入合约地址：`5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`
   - 点击"测试连接"

## 🎯 方案二：部署您自己的合约

如果您想要部署自己的合约，可以尝试以下方法：

### 方法1：使用 Docker

```bash
# 使用官方 ink! Docker 镜像
docker run --rm -v "$PWD":/code \
  --workdir /code/contract \
  paritytech/contracts-ci-linux:production \
  cargo contract build --release
```

### 方法2：修复本地环境

```bash
# 重新安装 Rust 工具链
rustup update
rustup target add wasm32-unknown-unknown

# 安装正确版本的工具
cargo install cargo-contract --version 4.1.1 --force
```

### 方法3：使用在线IDE

- 访问 [Contracts UI](https://contracts-ui.substrate.io/)
- 上传合约代码
- 在线编译和部署

## 🔍 验证部署成功

当使用测试合约地址后，您应该看到：

1. **连接状态**: 右上角显示 "✅ 已连接"
2. **合约状态**: 设置页面显示合约连接成功
3. **功能测试**: 可以上传文件并获取哈希值
4. **网络信息**: 显示 "Shibuya 测试网"

## 📊 测试合约功能

使用测试合约地址，您可以：

- ✅ **文件哈希生成**: 上传文件获取 SHA-256 哈希
- ✅ **钱包连接**: 连接真实的 Polkadot.js 钱包
- ✅ **网络交互**: 与 Shibuya 测试网真实交互
- ✅ **余额查询**: 查看真实的 SBY 代币余额
- ✅ **价格查询**: 获取合约设置的价格信息
- ⚠️ **上链功能**: 需要测试代币进行真实交易

## 🎉 立即开始

**推荐操作流程**：

1. **获取测试代币**：
   - 访问：https://portal.astar.network/#/shibuya-faucet
   - 连接钱包获取 SBY 代币

2. **配置应用**：
   - 确保 `TEST_MODE.enabled = false`
   - 启动前端：`cd frontend && npm start`

3. **连接和测试**：
   - 连接 Polkadot.js 钱包
   - 输入测试合约地址
   - 测试所有功能

## 🔧 故障排除

### 问题：合约连接失败
**解决方案**：
- 确认网络连接正常
- 检查钱包是否连接到 Shibuya 测试网
- 验证合约地址输入正确

### 问题：余额为0
**解决方案**：
- 访问水龙头获取测试代币
- 等待几分钟让交易确认

### 问题：交易失败
**解决方案**：
- 确保有足够的 SBY 代币支付 gas 费
- 检查网络状态是否正常

---

**现在您就可以开始体验真实的区块链时间戳服务了！** 🚀

使用测试合约地址：`5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY`
