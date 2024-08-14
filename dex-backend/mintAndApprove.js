require("dotenv").config();
const { ethers } = require("ethers");

// 从 .env 文件中加载私钥和Ganache URL
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);
const wallet = new ethers.Wallet(privateKey, provider);

// ERC20 代币合约的 ABI 和地址
const tokenABI = [
  "function mint(address to, uint256 amount) public",
  "function approve(address spender, uint256 amount) public returns (bool)",
];

const token0Address = "0xE9187dF444B561336c143B04E3a292502eCa2F33"; // token0 合约地址
const token1Address = "0xf226aD181540a36408b110988dF3c68A94335AB3"; // token1 合约地址

async function main() {
  // 获取 Token0 和 Token1 的合约实例
  const token0 = new ethers.Contract(token0Address, tokenABI, wallet);
  const token1 = new ethers.Contract(token1Address, tokenABI, wallet);

  // 目标地址和数量
  const recipientAddress = "0x0162d27D2B11da01D59df10994D104e6B94FF5B0"; // 替换为目标地址
  const amountToMint = ethers.utils.parseUnits("1000", 18); // 铸造1000个代币

  // 铸造代币
  const mintTx0 = await token0.mint(recipientAddress, amountToMint);
  await mintTx0.wait();
  console.log(`Minted ${amountToMint} Token0 to ${recipientAddress}`);

  const mintTx1 = await token1.mint(recipientAddress, amountToMint);
  await mintTx1.wait();
  console.log(`Minted ${amountToMint} Token1 to ${recipientAddress}`);

  // 授权 DEX 平台合约使用代币
  const dexAddress = "0x090Bc3ff8116D285ad616aF3A9dF066B64b3126F"; // DEX 平台合约地址
  const approveTx0 = await token0.approve(dexAddress, amountToMint);
  await approveTx0.wait();
  console.log(`Approved ${amountToMint} Token0 to DEX at ${dexAddress}`);

  const approveTx1 = await token1.approve(dexAddress, amountToMint);
  await approveTx1.wait();
  console.log(`Approved ${amountToMint} Token1 to DEX at ${dexAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
