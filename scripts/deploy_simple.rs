use std::env;
use std::process::Command;

fn main() {
    println!("🚀 TimeLock 简化部署脚本");
    println!("================================");

    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        println!("用法: cargo run --bin deploy_simple <network>");
        println!("网络选项:");
        println!("  - shibuya: Shibuya 测试网");
        println!("  - rococo: Rococo 测试网");
        return;
    }

    let network = &args[1];
    
    match network.as_str() {
        "shibuya" => {
            println!("🌐 准备部署到 Shibuya 测试网");
            deploy_to_shibuya();
        },
        "rococo" => {
            println!("🌐 准备部署到 Rococo 测试网");
            deploy_to_rococo();
        },
        _ => {
            println!("❌ 不支持的网络: {}", network);
            println!("支持的网络: shibuya, rococo");
        }
    }
}

fn deploy_to_shibuya() {
    println!("\n📋 Shibuya 测试网部署步骤:");
    println!("1. 访问水龙头获取测试代币:");
    println!("   https://portal.astar.network/#/shibuya-faucet");
    println!("\n2. 使用 Polkadot.js Apps 部署合约:");
    println!("   https://polkadot.js.org/apps/?rpc=wss://shibuya-rpc.dwellir.com#/contracts");
    println!("\n3. 上传合约文件:");
    println!("   - 点击 'Upload & deploy code'");
    println!("   - 选择合约文件 (stamping_contract.wasm)");
    println!("   - 设置初始价格 (建议: 1000)");
    println!("   - 确认部署");
    println!("\n4. 复制合约地址并配置前端");
    
    generate_config("Shibuya", "wss://shibuya-rpc.dwellir.com", "https://shibuya.subscan.io");
}

fn deploy_to_rococo() {
    println!("\n📋 Rococo 测试网部署步骤:");
    println!("1. 访问水龙头获取测试代币:");
    println!("   https://matrix.to/#/#rococo-faucet:matrix.org");
    println!("\n2. 使用 Polkadot.js Apps 部署合约:");
    println!("   https://polkadot.js.org/apps/?rpc=wss://rococo-rpc.polkadot.io#/contracts");
    println!("\n3. 上传合约文件:");
    println!("   - 点击 'Upload & deploy code'");
    println!("   - 选择合约文件 (stamping_contract.wasm)");
    println!("   - 设置初始价格 (建议: 1000)");
    println!("   - 确认部署");
    println!("\n4. 复制合约地址并配置前端");
    
    generate_config("Rococo", "wss://rococo-rpc.polkadot.io", "https://rococo.subscan.io");
}

fn generate_config(network_name: &str, rpc_url: &str, explorer_url: &str) {
    let config_content = format!(
        r#"
// 自动生成的前端配置 - {}
export const CONTRACT_CONFIG = {{
  network: "{}",
  contractAddress: "[请填入实际部署的合约地址]",
  rpcUrl: "{}",
  explorer: "{}"
}};

// 使用说明:
// 1. 将上面的 contractAddress 替换为实际部署的合约地址
// 2. 将此文件保存为 frontend/src/config/contract.ts
// 3. 重启前端应用
"#,
        network_name, network_name, rpc_url, explorer_url
    );

    let config_path = format!("config_{}.ts", network_name.to_lowercase());
    std::fs::write(&config_path, config_content).expect("无法写入配置文件");
    
    println!("\n✅ 配置文件已生成: {}", config_path);
    println!("�� 请按照文件中的说明配置前端");
} 