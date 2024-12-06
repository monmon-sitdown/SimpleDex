require("dotenv").config();
const { ethers } = require("ethers");

// load key and Ganache URL from .env
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);
const wallet = new ethers.Wallet(privateKey, provider);

// ABI and address of ERC20 tokens
const tokenABI = [
  "function mint(address to, uint256 amount) public",
  "function approve(address spender, uint256 amount) public returns (bool)",
];

const TokenAAddress = "0xD66e16d5ee57FB55f36b5F4FeB6da1922AF6DDA7";
const TokenBAddress = "0x590150D5BB3059E2f18Ec5CE136a839d97E9C1c5";
const TokenCAddress = "0xA75199d79CD32dd8B2942F36C01dB7a8Bde2351d";

async function main() {
  // Get tokens instance
  const TokenA = new ethers.Contract(TokenAAddress, tokenABI, wallet);
  const TokenB = new ethers.Contract(TokenBAddress, tokenABI, wallet);
  const TokenC = new ethers.Contract(TokenCAddress, tokenABI, wallet);

  // Target Address and minting amount
  //const recipientAddress = "0x42451b374c89fd4250a1f5930687a86bac532b3f"; // User amount(ganache)
  const recipientAddress = "0x0162d27D2B11da01D59df10994D104e6B94FF5B0";
  const amountToMint = ethers.utils.parseUnits("10000", 18); // mint 10000

  // minting
  const mintTxA = await TokenA.mint(recipientAddress, amountToMint);
  await mintTxA.wait();
  const mintTxB = await TokenB.mint(recipientAddress, amountToMint);
  await mintTxB.wait();
  const mintTxC = await TokenC.mint(recipientAddress, amountToMint);
  await mintTxC.wait();
  console.log(`Minted ${amountToMint} Token to ${recipientAddress}`);

  // Approve the dex platform to user the tokens
  const dexAddress = "0x14024406B95E8f821B1020Bb7fab45a18f863Edf"; // The address of DEX platform
  const approveTxA = await TokenA.approve(dexAddress, amountToMint);
  await approveTxA.wait();
  const approveTxB = await TokenB.approve(dexAddress, amountToMint);
  await approveTxB.wait();
  const approveTxC = await TokenC.approve(dexAddress, amountToMint);
  await approveTxC.wait();
  console.log(`Approved ${amountToMint} Token to DEX at ${dexAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
