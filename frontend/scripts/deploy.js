import { network } from "hardhat";

const { viem } = await network.connect({
  network: "localhost",
});

console.log("Deploying Counter contract to localhost...");

const publicClient = await viem.getPublicClient();
const [deployer] = await viem.getWalletClients();

console.log("Deploying contracts with the account:", deployer.account.address);

// Get account balance
const balance = await publicClient.getBalance({
  address: deployer.account.address,
});
console.log("Account balance:", balance.toString(), "wei");

// Deploy the Counter contract
const contract = await viem.deployContract("Counter", {
  account: deployer.account,
});

console.log("Counter contract deployed to:", contract.address);

// Get the initial value
const initialValue = await publicClient.readContract({
  address: contract.address,
  abi: contract.abi,
  functionName: "x",
});
console.log("Initial counter value:", initialValue.toString());

// Test the contract by incrementing
console.log("Testing contract by incrementing...");
const tx = await deployer.writeContract({
  address: contract.address,
  abi: contract.abi,
  functionName: "inc",
});

await publicClient.waitForTransactionReceipt({ hash: tx });
console.log("Increment transaction confirmed:", tx);

// Get the new value
const newValue = await publicClient.readContract({
  address: contract.address,
  abi: contract.abi,
  functionName: "x",
});
console.log("Counter value after increment:", newValue.toString());

console.log("Deployment and testing completed successfully!");
