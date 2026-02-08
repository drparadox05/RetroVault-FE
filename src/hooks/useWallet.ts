import { useState, useCallback } from "react";

export interface WalletState {
  address: string | null;
  network: string;
  isConnected: boolean;
  balance: string;
}

// Mock wallet hook — replace with wagmi + RainbowKit for production
export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    network: "Base",
    isConnected: false,
    balance: "1.42 ETH",
  });

  const connect = useCallback(() => {
    // Simulate wallet connection
    setWallet({
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
      network: "Base",
      isConnected: true,
      balance: "1.42 ETH",
    });
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      network: "Base",
      isConnected: false,
      balance: "0",
    });
  }, []);

  return { ...wallet, connect, disconnect };
}
