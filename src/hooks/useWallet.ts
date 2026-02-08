import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, formatEther } from "ethers";

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletState {
  address: string | null;
  network: string;
  isConnected: boolean;
  balance: string;
}

const NETWORK_NAMES: { [key: string]: string } = {
  "1": "Ethereum",
  "8453": "Base",
  "84532": "Base Sepolia",
  "11155111": "Sepolia",
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    network: "Not Connected",
    isConnected: false,
    balance: "0",
  });

  const updateBalance = useCallback(async (address: string, provider: BrowserProvider) => {
    try {
      const balance = await provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "0";
    }
  }, []);

  const updateNetwork = useCallback(async (provider: BrowserProvider) => {
    try {
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();
      return NETWORK_NAMES[chainId] || `Chain ${chainId}`;
    } catch (error) {
      console.error("Error fetching network:", error);
      return "Unknown";
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);

      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }

      const address = accounts[0];
      const balance = await updateBalance(address, provider);
      const network = await updateNetwork(provider);

      setWallet({
        address,
        network,
        isConnected: true,
        balance: `${parseFloat(balance).toFixed(4)} ETH`,
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);

      // Handle user rejection
      if (error.code === 4001) {
        throw new Error("Connection request rejected. Please approve the connection in MetaMask.");
      }

      throw error;
    }
  }, [updateBalance, updateNetwork]);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      network: "Not Connected",
      isConnected: false,
      balance: "0",
    });
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        const provider = new BrowserProvider(window.ethereum);
        const address = accounts[0];
        const balance = await updateBalance(address, provider);
        const network = await updateNetwork(provider);

        setWallet({
          address,
          network,
          isConnected: true,
          balance: `${parseFloat(balance).toFixed(4)} ETH`,
        });
      }
    };

    const handleChainChanged = () => {
      // Reload the page on network change as recommended by MetaMask
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [disconnect, updateBalance, updateNetwork]);

  return { ...wallet, connect, disconnect };
}
