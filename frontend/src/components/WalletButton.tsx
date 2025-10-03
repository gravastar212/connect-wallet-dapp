"use client";
import { useState } from "react";
import { ethers } from "ethers";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

export default function WalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connectWallet() {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof window.ethereum === "undefined") {
        setError("MetaMask is not installed! Please install MetaMask to continue.");
        return;
      }

      // Request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        setError("No accounts found. Please check your MetaMask wallet.");
        return;
      }

      const userAccount = accounts[0];
      setAccount(userAccount);

      // Create provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Fetch balance with error handling
      try {
        const bal = await provider.getBalance(userAccount);
        setBalance(ethers.formatEther(bal));
      } catch (balanceError) {
        console.warn("Failed to fetch balance:", balanceError);
        setError("Connected successfully, but unable to fetch balance.");
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      if (err.code === 4001) {
        setError("Connection rejected by user.");
      } else if (err.code === -32603) {
        setError("MetaMask is temporarily unavailable. Please try again.");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-400 text-sm">⚠️ {error}</p>
        </div>
      )}
      
      {account ? (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
          <p className="text-green-400 font-mono text-sm">
            ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          {balance && (
            <p className="text-yellow-400 font-mono text-sm mt-1">
              Balance: {parseFloat(balance).toFixed(4)} ETH
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isLoading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg"
          }`}
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
