# 🕒 TimeLock - 区块链文件时间戳服务

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![Ink!](https://img.shields.io/badge/Ink!-4.3.0-purple.svg)](https://use.ink/)

> **TimeLock** 是一个基于区块链的去中心化文件时间戳服务，允许用户将文件哈希值记录到区块链上，以证明文件在特定时间点的存在。

## 🌟 主要特性

- 🔐 **文件哈希生成**: 本地计算SHA-256哈希值，保护隐私
- ⏰ **区块链时间戳**: 将哈希值记录到Polkadot/Substrate区块链
- ✅ **哈希验证**: 验证文件是否已上链并获取时间戳
- 💰 **费用管理**: 透明的费用计算和支付系统
- 🦊 **钱包集成**: 支持Polkadot.js钱包扩展
- 🌐 **多网络支持**: 支持多个测试网络（Shibuya、Rococo、Astar）
- 📊 **统计面板**: 实时显示合约使用统计
- 📚 **历史记录**: 本地保存操作历史
- 🎭 **演示模式**: 完整的模拟体验，无需真实代币

## 🏗️ 技术架构

### 后端 (Smart Contract)
- **语言**: Rust + [Ink!](https://use.ink/) 4.3.0
- **区块链**: Polkadot/Substrate
- **功能**: 文件哈希存储、时间戳记录、费用管理

### 前端 (Web Application)
- **框架**: React 18 + TypeScript
- **样式**: CSS3 + 响应式设计
- **钱包**: Polkadot.js Extension
- **构建**: Create React App + CRACO

### 部署脚本
- **语言**: Rust + [Subxt](https://github.com/paritytech/subxt)
- **功能**: 自动化合约部署到测试网络

## 🚀 快速开始

### 前置要求
- [Node.js](https://nodejs.org/) 16+
- [Rust](https://rustup.rs/) 1.70+
- [cargo-contract](https://github.com/paritytech/cargo-contract) 3.2.0
- [Polkadot.js Extension](https://polkadot.js.org/extension/)

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/Carl7702/ZKP_Mate.git
cd ZKP_Mate
```

2. **启动前端**
```bash
cd frontend
npm install
npm start
```

3. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 演示模式
应用默认运行在演示模式下，提供完整的用户体验：
- 模拟区块链交互
- 无需真实代币
- 完整功能演示

## 📱 使用指南

### 1. 文件上传
- 拖拽或选择文件
- 自动生成SHA-256哈希值
- 显示费用估算

### 2. 钱包连接
- 安装Polkadot.js Extension
- 连接钱包账户
- 查看账户余额

### 3. 上链时间戳
- 确认费用信息
- 签名交易
- 等待区块链确认

### 4. 哈希验证
- 输入文件哈希值
- 查询区块链记录
- 获取时间戳信息

## 🌐 部署选项

### 前端部署
项目支持多种部署方式：

- **Vercel** (推荐): `npx vercel --prod`
- **Netlify**: `npx netlify deploy --prod --dir=build`
- **GitHub Pages**: 推送到gh-pages分支
- **Surge**: `npx surge build`

### 智能合约部署
使用提供的部署脚本：

```bash
cd scripts
cargo run --bin deploy_testnet
```

## 📊 项目结构

```
timelock/
├── contract/                 # 智能合约
│   ├── src/
│   │   └── lib.rs          # 合约主逻辑
│   └── Cargo.toml
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── services/       # 服务层
│   │   └── utils/          # 工具函数
│   └── package.json
├── scripts/                 # 部署脚本
│   ├── src/
│   │   └── main.rs         # 部署主程序
│   └── Cargo.toml
└── README.md
```

## 🔧 配置说明

### 网络配置
支持多个测试网络：
- **Shibuya**: 日本测试网络
- **Rococo**: Polkadot测试网络
- **Astar**: Astar测试网络

### 费用设置
- 默认价格: 1000 wei/字节
- 可配置的价格策略
- 透明的费用计算

## 🛡️ 安全特性

- ✅ **本地哈希计算**: 文件不会上传到服务器
- ✅ **钱包安全**: 使用官方Polkadot.js扩展
- ✅ **数据隐私**: 只有哈希值被记录
- ✅ **去中心化**: 基于区块链的不可篡改记录

## 📚 文档

- [生产部署指南](frontend/PRODUCTION_DEPLOYMENT.md)
- [真实部署指南](frontend/REAL_DEPLOYMENT_GUIDE.md)
- [快速设置指南](QUICK_SETUP_GUIDE.md)
- [部署解决方案](DEPLOYMENT_SOLUTION.md)
- [合约测试解决方案](CONTRACT_TEST_SOLUTION.md)

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Ink!](https://use.ink/) - 智能合约框架
- [Polkadot.js](https://polkadot.js.org/) - 区块链交互库
- [Subxt](https://github.com/paritytech/subxt) - Substrate客户端库
- [React](https://reactjs.org/) - 前端框架

## 📞 联系方式

- 项目地址: [https://github.com/Carl7702/ZKP_Mate](https://github.com/Carl7702/ZKP_Mate)
- 问题反馈: [Issues](https://github.com/Carl7702/ZKP_Mate/issues)

---

**🌟 现在就体验区块链时间戳服务，让您的文件拥有不可篡改的时间证明！** 