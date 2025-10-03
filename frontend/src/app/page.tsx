import WalletButton from "@/components/WalletButton";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">🚀 Connect Wallet dApp</h1>
        <WalletButton />
      </div>
    </main>
  );
}