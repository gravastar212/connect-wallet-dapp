import { network } from "hardhat";

const { viem } = await network.connect({
  network: "localhost",
});

console.log("Interacting with Counter contract...");

const publicClient = await viem.getPublicClient();
const [deployer] = await viem.getWalletClients();

// Contract address from deployment
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

console.log("Contract address:", contractAddress);
console.log("Deployer address:", deployer.account.address);

// Get the current counter value
console.log("\n1. Reading current counter value...");
const currentValue = await publicClient.readContract({
  address: contractAddress,
  abi: [
    {
      "inputs": [],
      "name": "x",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  functionName: "x",
});
console.log("Current counter value:", currentValue.toString());

// Increment the counter by 1
console.log("\n2. Incrementing counter by 1...");
const incTx = await deployer.writeContract({
  address: contractAddress,
  abi: [
    {
      "inputs": [],
      "name": "inc",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  functionName: "inc",
});

console.log("Increment transaction hash:", incTx);
await publicClient.waitForTransactionReceipt({ hash: incTx });
console.log("Increment transaction confirmed!");

// Check the new value
const newValue = await publicClient.readContract({
  address: contractAddress,
  abi: [
    {
      "inputs": [],
      "name": "x",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  functionName: "x",
});
console.log("New counter value:", newValue.toString());

// Increment by a specific amount
console.log("\n3. Incrementing counter by 3...");
const incByTx = await deployer.writeContract({
  address: contractAddress,
  abi: [
    {
      "inputs": [{"internalType": "uint256", "name": "by", "type": "uint256"}],
      "name": "incBy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  functionName: "incBy",
  args: [3n],
});

console.log("Increment by 3 transaction hash:", incByTx);
await publicClient.waitForTransactionReceipt({ hash: incByTx });
console.log("Increment by 3 transaction confirmed!");

// Check the final value
const finalValue = await publicClient.readContract({
  address: contractAddress,
  abi: [
    {
      "inputs": [],
      "name": "x",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  functionName: "x",
});
console.log("Final counter value:", finalValue.toString());

console.log("\n✅ Contract interaction completed successfully!");
console.log("This was your first blockchain interaction - local, safe, and free!");
