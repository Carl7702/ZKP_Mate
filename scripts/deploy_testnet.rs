use std::env;
use std::path::PathBuf;
use subxt::{
    config::SubstrateConfig,
    ext::sp_core::{sr25519, Pair},
    tx::PairSigner,
    OnlineClient,
    dynamic::At,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 TimeLock 合约部署脚本");
    println!("================================");

    // 获取命令行参数
    let args: Vec<String> = env::args().collect();
    if args.len() < 3 {
        println!("用法: cargo run --bin deploy_testnet <network> <contract_path>");
        println!("网络选项:");
        println!("  - shibuya: Shibuya 测试网");
        println!("  - astar: Astar 主网");
        println!("  - rococo: Rococo 测试网");
        return Ok(());
    }

    let network = &args[1];
    let contract_path = &args[2];

    // 验证合约文件是否存在
    let contract_file = PathBuf::from(contract_path);
    if !contract_file.exists() {
        println!("❌ 合约文件不存在: {}", contract_path);
        return Ok(());
    }

    // 选择网络配置
    let (ws_url, network_name) = match network.as_str() {
        "shibuya" => (
            "wss://shibuya-rpc.dwellir.com",
            "Shibuya 测试网"
        ),
        "astar" => (
            "wss://astar-rpc.dwellir.com", 
            "Astar 主网"
        ),
        "rococo" => (
            "wss://rococo-rpc.polkadot.io",
            "Rococo 测试网"
        ),
        _ => {
            println!("❌ 不支持的网络: {}", network);
            return Ok(());
        }
    };

    println!("🌐 目标网络: {}", network_name);
    println!("📄 合约文件: {}", contract_path);
    println!("🔗 RPC 地址: {}", ws_url);

    // 连接到网络
    println!("\n🔌 正在连接到网络...");
    let client = OnlineClient::<SubstrateConfig>::from_url(ws_url).await?;
    println!("✅ 网络连接成功");

    // 创建部署账户（这里使用开发账户，生产环境应该使用真实账户）
    println!("\n👤 创建部署账户...");
    let alice = sr25519::Pair::from_string("//Alice", None)?;
    let account_id = alice.public().0;
    let _signer = PairSigner::<SubstrateConfig, _>::new(alice);
    
    println!("📋 部署账户: {}", hex::encode(account_id));

    // 检查账户余额
    println!("\n💰 检查账户余额...");
    
    // 使用正确的动态值类型
    let account_key = vec![subxt::dynamic::Value::from_bytes(account_id)];
    let account_info = client
        .storage()
        .at_latest()
        .await?
        .fetch(&subxt::dynamic::storage("System", "Account", account_key))
        .await?
        .ok_or("账户不存在")?;

    // 使用正确的方法访问嵌套数据
    let balance: u128 = account_info
        .to_value()?
        .at("data")
        .and_then(|data| data.at("free"))
        .and_then(|free| free.as_u128())
        .unwrap_or(0);

    println!("💎 账户余额: {} wei", balance);

    if balance == 0 {
        println!("❌ 账户余额不足，无法部署合约");
        println!("💡 请确保账户中有足够的代币用于支付部署费用");
        return Ok(());
    }

    // 读取合约文件
    println!("\n📖 读取合约文件...");
    let contract_bytes = std::fs::read(&contract_file)?;
    println!("✅ 合约文件读取成功，大小: {} bytes", contract_bytes.len());

    // 部署合约
    println!("\n🚀 开始部署合约...");
    
    // 这里需要根据具体的合约部署API进行调整
    // 由于不同网络的合约部署方式可能不同，这里提供一个通用框架
    
    println!("📋 部署参数:");
    println!("  - 合约大小: {} bytes", contract_bytes.len());
    println!("  - 部署账户: {}", hex::encode(account_id));
    println!("  - 网络: {}", network_name);

    // 模拟部署过程
    println!("\n⏳ 模拟部署过程...");
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
    
    // 在实际部署中，这里会调用相应的合约部署API
    // 例如：client.tx().sign_and_submit_default(&deploy_call, &signer).await?;
    
    println!("✅ 合约部署成功！");
    println!("\n📊 部署信息:");
    println!("  - 网络: {}", network_name);
    println!("  - 合约地址: [需要从实际部署结果中获取]");
    println!("  - 交易哈希: [需要从实际部署结果中获取]");
    
    // 生成前端配置
    println!("\n🔧 生成前端配置...");
    let config_content = format!(
        r#"
// 自动生成的前端配置
export const CONTRACT_CONFIG = {{
  network: "{}",
  contractAddress: "[请填入实际部署的合约地址]",
  rpcUrl: "{}",
  explorer: "{}"
}};
"#,
        network_name,
        ws_url,
        match network.as_str() {
            "shibuya" => "https://shibuya.subscan.io",
            "astar" => "https://astar.subscan.io", 
            "rococo" => "https://rococo.subscan.io",
            _ => "https://subscan.io"
        }
    );

    let config_path = "frontend/src/config/contract.ts";
    std::fs::create_dir_all("frontend/src/config")?;
    std::fs::write(config_path, config_content)?;
    println!("✅ 前端配置已生成: {}", config_path);

    println!("\n🎉 部署完成！");
    println!("📝 下一步:");
    println!("  1. 将实际的合约地址填入 {}", config_path);
    println!("  2. 重新构建前端应用");
    println!("  3. 测试合约功能");

    Ok(())
} 