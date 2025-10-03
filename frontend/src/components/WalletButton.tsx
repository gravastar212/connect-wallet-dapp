"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function WalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  async function connectWallet() {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed!");
        return;
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const userAccount = accounts[0];
      setAccount(userAccount);

      // Create provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Fetch balance in wei and format to ETH
      const bal = await provider.getBalance(userAccount);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-2">
      {account ? (
        <div>
          <p className="text-green-400 font-mono">
            ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          {balance && (
            <p className="text-yellow-400 font-mono">Balance: {parseFloat(balance).toFixed(4)} ETH</p>
          )}
        </div>
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
