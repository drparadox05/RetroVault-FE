import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";
import Taskbar from "@/components/win95/Taskbar";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { connect, isConnected } = useWallet();

  const handleConnect = () => {
    connect();
    navigate("/dashboard");
  };

  return (
    <div className="win95-desktop min-h-screen flex items-center justify-center pb-10">
      {/* Connect Wallet Window */}
      <div className="win95-outset bg-card w-[420px]">
        {/* Title Bar */}
        <div className="bg-win95-titlebar px-2 py-0.5 flex items-center justify-between">
          <span className="text-primary-foreground font-pixel text-lg">
            🪟 OnChain Strategy Bot v1.0
          </span>
          <div className="flex gap-0.5">
            <button className="win95-button !p-0 w-4 h-3.5 text-[10px] leading-none flex items-center justify-center">
              _
            </button>
            <button className="win95-button !p-0 w-4 h-3.5 text-[10px] leading-none flex items-center justify-center">
              □
            </button>
            <button className="win95-button !p-0 w-4 h-3.5 text-[10px] leading-none flex items-center justify-center">
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-3">
            <div className="font-pixel text-4xl">🖥️</div>
            <h1 className="font-pixel text-3xl">
              Welcome to OnChain
              <br />
              Strategy Bot
            </h1>
            <p className="text-sm font-mono text-muted-foreground">
              Automated crypto trading strategies
              <br />
              with real onchain execution
            </p>
          </div>

          <div className="win95-inset bg-input p-3 text-xs font-mono space-y-1">
            <div>C:\STRATEGIES&gt; dir</div>
            <div className="text-muted-foreground">
              &nbsp; BUY_THE_DIP.exe &nbsp;&nbsp; 420 KB
            </div>
            <div className="text-muted-foreground">
              &nbsp; MULTI_LP.exe &nbsp;&nbsp;&nbsp;&nbsp; [LOCKED]
            </div>
            <div className="text-muted-foreground">
              &nbsp; DCA.exe &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              [LOCKED]
            </div>
            <div className="mt-1">
              C:\STRATEGIES&gt; connect_wallet
              <span className="animate-blink">▌</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              className="win95-button w-full font-pixel text-xl py-2"
              onClick={handleConnect}
            >
              🦊 Connect Wallet
            </button>
            <div className="flex gap-1">
              <div className="win95-inset flex-1 px-2 py-1 text-xs font-mono text-center text-muted-foreground">
                Ethereum
              </div>
              <div className="win95-inset flex-1 px-2 py-1 text-xs font-mono text-center text-muted-foreground">
                Base
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-muted-foreground font-mono">
            © 2025 OnChain Strategy Bot • Built for ETH Denver
          </div>
        </div>
      </div>

      <Taskbar />
    </div>
  );
};

export default Index;
