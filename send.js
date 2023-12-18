const { ethers } = require("ethers");
const config = require("./config")



// 连接到结点
const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

// 创建钱包
const wallet = new ethers.Wallet(config.privateKey.trim(), provider);

// 获取钱包地址
const walletAddress = wallet.address;
console.log('Wallet Address:', walletAddress);

// 获取当前账户的 nonce
async function getCurrentNonce(wallet) {
  try {
    const nonce = await wallet.getTransactionCount("pending");
    console.log("Nonce:", nonce);
    return nonce;
  } catch (error) {
    console.error("Error fetching nonce:", error.message);
    throw error;
  }
}

// 获取当前主网 gas 价格
async function getGasPrice() {
  const gasPrice = await provider.getGasPrice();
  return gasPrice;
}

// 获取钱包余额
async function getWalletBalance() {
  try {
    // 获取钱包余额
    const balance = await provider.getBalance(walletAddress);

    // 将余额从 Wei 转换为 Ether
    const balanceInEther = ethers.utils.formatEther(balance);

    console.log(`Wallet Balance: ${balanceInEther} ETH`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 获取地址的交易历史
async function getAddressTransactions() {
  try {
    // 获取地址的交易列表
    const apiEndpoint = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&apikey=${config.etherscanApiKey}`;
    const response = await fetch(apiEndpoint);
    const data = await response.json();

    // 打印交易历史
    console.log('Address Transactions:', data.result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 发送多次交易
async function main() {
  getWalletBalance()
  // getAddressTransactions()
  const currentNonce = await getCurrentNonce(wallet);
  // const sleepTime = config.sleepTime

  // for (let i = 0; i < config.repeatCount; i++) {
  //   //const gasPrice = await getGasPrice();
  //   await sendTransaction(currentNonce + i);
  //   await sleep(sleepTime)
  // }
}

main();