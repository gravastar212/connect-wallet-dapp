"use client"; 
import { useState } from "react";
import { ethers } from "ethers";

export default function WalletButton() {
  const [account, setAccount] = useState<string | null>(null);

  // Function to connect wallet
  async function connectWallet() {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed!");
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Save first account
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {account ? (
        <p className="text-green-400 font-mono">
          ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}