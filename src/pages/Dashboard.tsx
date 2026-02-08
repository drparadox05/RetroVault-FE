import React from "react";
import Win95Window from "@/components/win95/Win95Window";
import Taskbar from "@/components/win95/Taskbar";
import BuyTheDipWindow from "@/components/strategies/BuyTheDipWindow";
import { useWallet } from "@/hooks/useWallet";

const Dashboard: React.FC = () => {
  const { address, network } = useWallet();

  return (
    <div className="win95-desktop min-h-screen pb-10 relative overflow-hidden">
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6">
        {[
          { icon: "💻", label: "My Computer" },
          { icon: "🗑️", label: "Recycle Bin" },
          { icon: "📊", label: "Strategies" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1 cursor-pointer group w-16"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="text-primary-foreground text-xs text-center font-pixel text-sm bg-win95-titlebar px-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Buy the Dip Window */}
      <Win95Window
        title="📉 Buy the Dip — ETH Strategy"
        defaultPosition={{ x: 120, y: 30 }}
        width={420}
        icon="📉"
      >
        <BuyTheDipWindow />
      </Win95Window>

      {/* Multi-Asset LP Window */}
      <Win95Window
        title="🏊 Multi-Asset LP"
        defaultPosition={{ x: 560, y: 60 }}
        width={300}
        disabled
        icon="🏊"
      >
        <div />
      </Win95Window>

      {/* DCA Window */}
      <Win95Window
        title="📅 DCA Strategy"
        defaultPosition={{ x: 580, y: 250 }}
        width={280}
        disabled
        icon="📅"
      >
        <div />
      </Win95Window>

      {/* Portfolio Summary Window */}
      <Win95Window
        title="💰 Portfolio"
        defaultPosition={{ x: 560, y: 420 }}
        width={300}
        icon="💰"
      >
        <div className="space-y-2">
          <div className="win95-inset bg-input p-2 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span>Total Deposited:</span>
              <span className="font-bold">0.50 ETH</span>
            </div>
            <div className="flex justify-between">
              <span>Current Value:</span>
              <span className="font-bold">0.54 ETH</span>
            </div>
            <div className="flex justify-between">
              <span>P&L:</span>
              <span className="text-win95-green font-bold">+0.04 ETH (+8%)</span>
            </div>
            <div className="flex justify-between">
              <span>Trades Executed:</span>
              <span className="font-bold">12</span>
            </div>
          </div>
        </div>
      </Win95Window>

      <Taskbar walletAddress={address || undefined} network={network} />
    </div>
  );
};

export default Dashboard;
