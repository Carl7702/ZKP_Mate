# TimeLock 项目构建脚本
# 使用 make 命令来简化构建和部署流程

.PHONY: help build-contract build-frontend build-scripts test clean deploy start-node deploy-shibuya deploy-rococo

# 默认目标
help:
	@echo "🔒 TimeLock - 去中心化时间戳服务"
	@echo ""
	@echo "可用命令:"
	@echo "  build-contract    - 构建智能合约"
	@echo "  build-frontend    - 构建前端应用"
	@echo "  build-scripts     - 构建部署脚本"
	@echo "  build-all         - 构建所有组件"
	@echo "  test              - 运行所有测试"
	@echo "  clean             - 清理构建文件"
	@echo "  deploy            - 部署合约到本地节点"
	@echo "  start-node        - 启动本地Substrate节点"
	@echo "  start-frontend    - 启动前端开发服务器"
	@echo "  install-deps      - 安装所有依赖"
	@echo "  deploy-shibuya    - 部署到 Shibuya 测试网"
	@echo "  deploy-rococo     - 部署到 Rococo 测试网"
	@echo "  setup-testnet     - 设置测试网环境"

# 构建智能合约
build-contract:
	@echo "🔨 构建智能合约..."
	cd contract && cargo build --release
	@echo "✅ 智能合约构建完成"

# 构建前端应用
build-frontend:
	@echo "🔨 构建前端应用..."
	cd frontend && npm install
	cd frontend && npm run build
	@echo "✅ 前端应用构建完成"

# 构建部署脚本
build-scripts:
	@echo "🔨 构建部署脚本..."
	cd scripts && cargo build --release
	@echo "✅ 部署脚本构建完成"

# 构建所有组件
build-all: build-contract build-scripts build-frontend
	@echo "🎉 所有组件构建完成"

# 运行测试
test:
	@echo "🧪 运行智能合约测试..."
	cd contract && cargo test
	@echo "🧪 运行脚本测试..."
	cd scripts && cargo test
	@echo "✅ 所有测试完成"

# 清理构建文件
clean:
	@echo "🧹 清理构建文件..."
	cd contract && cargo clean
	cd scripts && cargo clean
	cd frontend && rm -rf node_modules build
	@echo "✅ 清理完成"

# 启动本地Substrate节点
start-node:
	@echo "🚀 启动本地Substrate节点..."
	@echo "💡 请确保已安装 substrate-contracts-node"
	@echo "📝 运行: substrate-contracts-node --dev"
	@echo "🌐 节点将在 http://127.0.0.1:9944 启动"

# 部署合约到本地节点
deploy:
	@echo "🚀 部署合约到本地节点..."
	@echo "⚠️  请确保本地节点正在运行"
	cd scripts && cargo run --release -- deploy --contract-path ../contract/target/ink/stamping_contract.wasm

# 启动前端开发服务器
start-frontend:
	@echo "🚀 启动前端开发服务器..."
	cd frontend && npm start

# 安装所有依赖
install-deps:
	@echo "📦 安装Rust依赖..."
	cargo install cargo-contract
	@echo "📦 安装前端依赖..."
	cd frontend && npm install
	@echo "✅ 所有依赖安装完成"

# 生成合约元数据
generate-metadata:
	@echo "📋 生成合约元数据..."
	cd contract && cargo contract build
	@echo "✅ 合约元数据生成完成"

# 运行端到端测试
test-e2e:
	@echo "🧪 运行端到端测试..."
	cd scripts && cargo run --release -- test --contract-address <contract-address>

# 生成测试哈希
generate-test-hash:
	@echo "🔍 生成测试哈希..."
	cd scripts && cargo run --release -- generate-hash --content "Hello, TimeLock!"

# 检查环境
check-env:
	@echo "🔍 检查开发环境..."
	@echo "Rust版本:"
	@rustc --version
	@echo "Node.js版本:"
	@node --version
	@echo "npm版本:"
	@npm --version
	@echo "✅ 环境检查完成"

# 设置测试网环境
setup-testnet:
	@echo "🌐 设置测试网环境..."
	@echo "📋 请确保已完成以下步骤："
	@echo "  1. 安装 Polkadot.js 扩展"
	@echo "  2. 创建测试账户"
	@echo "  3. 获取测试网代币"
	@echo "  4. 配置网络设置"
	@echo "📖 详细说明请查看 DEPLOYMENT.md"

# 部署到 Shibuya 测试网
deploy-shibuya:
	@echo "🚀 部署到 Shibuya 测试网..."
	@echo "⚠️  请确保已获取 SBY 测试代币"
	@echo "💡 水龙头: https://portal.astar.network/#/shibuya-faucet"
	cd scripts && cargo run --release --bin deploy_testnet shibuya ../contract/target/ink/stamping_contract.wasm

# 部署到 Rococo 测试网
deploy-rococo:
	@echo "🚀 部署到 Rococo 测试网..."
	@echo "⚠️  请确保已获取 ROC 测试代币"
	@echo "💡 水龙头: https://matrix.to/#/#rococo-faucet:matrix.org"
	cd scripts && cargo run --release --bin deploy_testnet rococo ../contract/target/ink/stamping_contract.wasm

# 开发模式（同时启动前端和节点）
dev: start-node
	@echo "🔄 开发模式启动..."
	@echo "💡 前端将在 http://localhost:3000 启动"
	@echo "💡 节点将在 http://127.0.0.1:9944 启动"
	@echo "📝 请在新终端中运行: make start-frontend"

# 生产构建
build-production:
	@echo "🏭 构建生产版本..."
	make build-contract
	make build-frontend
	@echo "✅ 生产版本构建完成"

# 检查合约状态
check-contract:
	@echo "🔍 检查合约状态..."
	@if [ -f "contract/target/ink/stamping_contract.wasm" ]; then \
		echo "✅ 合约文件存在"; \
		ls -lh contract/target/ink/stamping_contract.wasm; \
	else \
		echo "❌ 合约文件不存在，请先运行 make build-contract"; \
	fi 