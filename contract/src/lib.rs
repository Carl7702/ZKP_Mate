#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod stamping_contract {
    use ink::storage::Mapping;

    /// 合约存储结构
    #[ink(storage)]
    pub struct StampingContract {
        /// 哈希值到时间戳的映射
        timestamps: Mapping<[u8; 32], u64>,
        /// 每字节价格（wei）
        price_per_byte: u128,
        /// 合约拥有者
        owner: AccountId,
        /// 统计数据
        total_hashes: u32,
        total_volume: u128,
        last_updated: u64,
    }

    /// 哈希值已上链事件
    #[ink(event)]
    pub struct HashStamped {
        /// 文件哈希值
        #[ink(topic)]
        hash: [u8; 32],
        /// 上链时间戳
        timestamp: u64,
        /// 提交者账户
        #[ink(topic)]
        submitter: AccountId,
    }

    /// 支付成功事件
    #[ink(event)]
    pub struct PaymentReceived {
        #[ink(topic)]
        from: AccountId,
        amount: Balance,
        file_size: u64,
    }

    /// 价格更新事件
    #[ink(event)]
    pub struct PriceUpdated {
        old_price: u128,
        new_price: u128,
    }

    /// 合约错误类型
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum ContractError {
        /// 支付金额不足
        InsufficientPayment,
        /// 哈希值已存在
        HashAlreadyExists,
        /// 只有拥有者可以执行此操作
        OnlyOwner,
        /// 无效的文件大小
        InvalidFileSize,
    }

    pub type Result<T> = core::result::Result<T, ContractError>;

    impl StampingContract {
        /// 构造函数（默认价格为1000 wei/byte）
        #[ink(constructor)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            Self {
                timestamps: Mapping::new(),
                price_per_byte: 1000,
                owner: caller,
                total_hashes: 0,
                total_volume: 0,
                last_updated: Self::env().block_timestamp(),
            }
        }

        /// 带初始价格的构造函数
        #[ink(constructor)]
        pub fn new_with_price(price_per_byte: u128) -> Self {
            let caller = Self::env().caller();
            Self {
                timestamps: Mapping::new(),
                price_per_byte,
                owner: caller,
                total_hashes: 0,
                total_volume: 0,
                last_updated: Self::env().block_timestamp(),
            }
        }

        /// 提交文件哈希值到区块链
        #[ink(message, payable)]
        pub fn stamp_hash(&mut self, hash: [u8; 32], file_size: u64) -> Result<()> {
            // 检查哈希值是否已存在
            if self.timestamps.contains(hash) {
                return Err(ContractError::HashAlreadyExists);
            }

            // 检查文件大小是否有效
            if file_size == 0 {
                return Err(ContractError::InvalidFileSize);
            }

            // 计算所需费用
            let required_payment = self.price_per_byte.saturating_mul(file_size as u128);
            let payment = self.env().transferred_value();

            // 检查支付是否足够
            if payment < required_payment {
                return Err(ContractError::InsufficientPayment);
            }

            // 记录时间戳
            let timestamp = self.env().block_timestamp();
            self.timestamps.insert(hash, &timestamp);

            // 更新统计数据
            self.total_hashes = self.total_hashes.saturating_add(1);
            self.total_volume = self.total_volume.saturating_add(payment);
            self.last_updated = timestamp;

            // 发出事件
            let caller = self.env().caller();
            self.env().emit_event(HashStamped {
                hash,
                timestamp,
                submitter: caller,
            });

            self.env().emit_event(PaymentReceived {
                from: caller,
                amount: payment,
                file_size,
            });

            Ok(())
        }

        /// 查询哈希值的时间戳
        #[ink(message)]
        pub fn get_timestamp(&self, hash: [u8; 32]) -> Option<u64> {
            self.timestamps.get(hash)
        }

        /// 验证哈希值是否存在
        #[ink(message)]
        pub fn verify_hash(&self, hash: [u8; 32]) -> bool {
            self.timestamps.contains(hash)
        }

        /// 获取当前价格
        #[ink(message)]
        pub fn get_price_per_byte(&self) -> u128 {
            self.price_per_byte
        }

        /// 设置价格（仅拥有者）
        #[ink(message)]
        pub fn set_price_per_byte(&mut self, new_price: u128) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(ContractError::OnlyOwner);
            }

            let old_price = self.price_per_byte;
            self.price_per_byte = new_price;

            self.env().emit_event(PriceUpdated {
                old_price,
                new_price,
            });

            Ok(())
        }

        /// 获取合约统计信息
        #[ink(message)]
        pub fn get_stats(&self) -> (u32, u128, u64) {
            (self.total_hashes, self.total_volume, self.last_updated)
        }

        /// 获取合约拥有者
        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }

        /// 提取合约余额（仅拥有者）
        #[ink(message)]
        pub fn withdraw(&mut self, amount: Balance) -> Result<()> {
            if self.env().caller() != self.owner {
                return Err(ContractError::OnlyOwner);
            }

            if self.env().transfer(self.owner, amount).is_err() {
                return Err(ContractError::InsufficientPayment);
            }

            Ok(())
        }

        /// 获取合约余额
        #[ink(message)]
        pub fn get_balance(&self) -> Balance {
            self.env().balance()
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn new_works() {
            let contract = StampingContract::new();
            assert_eq!(contract.get_price_per_byte(), 1000);
        }

        #[ink::test]
        fn verify_hash_works() {
            let contract = StampingContract::new();
            let hash = [1u8; 32];
            assert!(!contract.verify_hash(hash));
        }
    }
}