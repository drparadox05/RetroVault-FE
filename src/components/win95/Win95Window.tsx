import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface Win95WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultPosition?: { x: number; y: number };
  width?: number;
  height?: number;
  onClose?: () => void;
  minimized?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Win95Window: React.FC<Win95WindowProps> = ({
  title,
  children,
  className,
  defaultPosition = { x: 50, y: 50 },
  width,
  height,
  onClose,
  minimized = false,
  disabled = false,
  icon,
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(minimized);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [position]);

  if (isMinimized) return null;

  return (
    <div
      className={cn("absolute win95-outset bg-card", className)}
      style={{
        left: position.x,
        top: position.y,
        width: width || "auto",
        height: height || "auto",
        zIndex: isDragging ? 50 : 10,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex items-center justify-between px-1 py-0.5 select-none cursor-move",
          disabled ? "bg-win95-titlebar-inactive" : "bg-win95-titlebar"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1 text-primary-foreground font-pixel text-lg truncate">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="truncate">{title}</span>
        </div>
        <div className="flex gap-0.5">
          <button
            className="win95-button !p-0 w-4 h-3.5 text-[10px] leading-none flex items-center justify-center"
            onClick={() => setIsMinimized(true)}
          >
            _
          </button>
          <button className="win95-button !p-0 w-4 h-3.5 text-[10px] leading-none flex items-center justify-center">
            □
          </button>
          {onClose && (
            <button
              className="win95-button !p-0 w-4 h-3.5 text-[10px] leading-none flex items-center justify-center"
              onClick={onClose}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-2">
        {disabled ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground font-pixel text-xl">
            🚧 Coming Soon...
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default Win95Window;
