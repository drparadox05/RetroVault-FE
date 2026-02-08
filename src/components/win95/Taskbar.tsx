import React, { useState, useEffect } from "react";

interface TaskbarProps {
  walletAddress?: string;
  network?: string;
}

const Taskbar: React.FC<TaskbarProps> = ({ walletAddress, network }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-card win95-outset flex items-center justify-between px-1 z-50">
      <div className="flex items-center gap-1">
        <button className="win95-button font-pixel text-base flex items-center gap-1 px-3">
          <span className="text-lg">🪟</span>
          <span className="font-bold">Start</span>
        </button>

        {walletAddress && (
          <div className="win95-inset px-2 py-0.5 text-xs flex items-center gap-1 ml-2 bg-input">
            <span className="inline-block w-2 h-2 rounded-full bg-win95-green" />
            <span className="font-mono">{truncateAddress(walletAddress)}</span>
            {network && (
              <span className="text-muted-foreground ml-1">({network})</span>
            )}
          </div>
        )}
      </div>

      <div className="win95-inset px-3 py-0.5 text-xs font-mono">
        {formatTime(time)}
      </div>
    </div>
  );
};

export default Taskbar;
