# 🚀 TimeLock 部署指南

## 📋 概述

本指南将帮助您将TimeLock应用部署到生产环境，让其他用户可以访问和使用这个服务。

## 🎯 当前状态

✅ **已完成**：
- 前端应用已配置为生产模式
- 连接到Shibuya测试网络
- 使用示例合约地址进行演示
- 所有核心功能正常工作

## 🌐 部署选项

### 选项1：Vercel部署（推荐）

1. **准备代码**：
   ```bash
   cd frontend
   npm run build
   ```

2. **部署到Vercel**：
   - 访问 [vercel.com](https://vercel.com)
   - 连接GitHub仓库
   - 选择`frontend`目录作为根目录
   - 自动部署

3. **配置环境变量**：
   ```
   REACT_APP_ENV=production
   REACT_APP_DEFAULT_NETWORK=shibuya
   ```

### 选项2：Netlify部署

1. **构建应用**：
   ```bash
   cd frontend
   npm run build
   ```

2. **部署到Netlify**：
   - 访问 [netlify.com](https://netlify.com)
   - 拖拽`build`文件夹到部署区域
   - 或连接GitHub仓库自动部署

### 选项3：GitHub Pages

1. **安装gh-pages**：
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **添加部署脚本到package.json**：
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     },
     "homepage": "https://yourusername.github.io/timelock"
   }
   ```

3. **部署**：
   ```bash
   npm run deploy
   ```

## 🔧 生产配置

### 当前配置状态

- ✅ **测试模式**：已关闭
- ✅ **网络连接**：Shibuya测试网
- ✅ **合约地址**：示例地址已配置
- ✅ **钱包连接**：支持Polkadot.js扩展

### 网络设置

应用当前配置为连接以下网络：

1. **Shibuya测试网**（默认）：
   - RPC: `wss://shibuya-rpc.dwellir.com`
   - 类型: Astar测试网络
   - 代币: SBY

2. **Rococo合约测试网**：
   - RPC: `wss://rococo-contracts-rpc.polkadot.io`
   - 类型: Polkadot测试网络
   - 代币: ROC

## 👥 用户使用指南

部署后，用户需要：

1. **安装钱包**：
   - 安装Polkadot.js浏览器扩展
   - 创建或导入账户

2. **获取测试代币**：
   - Shibuya水龙头: [portal.astar.network](https://portal.astar.network)
   - Rococo水龙头: [polkadot.js.org/apps](https://polkadot.js.org/apps)

3. **使用应用**：
   - 访问部署的网站
   - 连接钱包
   - 上传文件获取哈希
   - 支付费用上链时间戳

## 🔍 功能验证

部署后请验证以下功能：

### ✅ 基础功能
- [ ] 网站正常加载
- [ ] 钱包连接正常
- [ ] 网络切换正常
- [ ] 文件哈希生成

### ✅ 核心功能
- [ ] 文件上传和哈希计算
- [ ] 费用估算显示
- [ ] 上链交易（演示模式）
- [ ] 哈希验证功能

### ✅ 用户体验
- [ ] 响应式设计
- [ ] 错误处理
- [ ] 加载状态
- [ ] 成功反馈

## 🛠 故障排除

### 常见问题

1. **钱包连接失败**：
   - 确保用户安装了Polkadot.js扩展
   - 检查网络连接
   - 刷新页面重试

2. **网络连接问题**：
   - 检查RPC端点是否可用
   - 尝试切换到其他网络
   - 查看浏览器控制台错误

3. **交易失败**：
   - 确保账户有足够余额
   - 检查网络拥堵情况
   - 重试交易

## 📊 监控和维护

### 建议监控项目

1. **网站可用性**：
   - 使用Uptime监控服务
   - 设置告警通知

2. **用户反馈**：
   - 收集用户使用反馈
   - 监控错误日志

3. **网络状态**：
   - 监控测试网络状态
   - 关注网络升级通知

## 🚀 下一步

1. **真实合约部署**：
   - 编译并部署真实合约
   - 更新合约地址和ABI
   - 测试完整功能

2. **功能增强**：
   - 添加用户历史记录
   - 实现批量上链
   - 增加更多网络支持

3. **用户体验优化**：
   - 添加使用教程
   - 优化移动端体验
   - 增加多语言支持

---

## 📞 支持

如果在部署过程中遇到问题，请：

1. 检查浏览器控制台错误
2. 确认网络连接正常
3. 验证钱包扩展已安装
4. 查看本文档的故障排除部分

**现在您的TimeLock应用已经可以供其他用户使用了！** 🎉
