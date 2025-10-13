"use client";

import { Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MicrophoneAnimationProps {
  isActive: boolean;
  callDuration: number;
}

export default function MicrophoneAnimation({ isActive, callDuration }: MicrophoneAnimationProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            isActive
              ? "bg-none"
              : "bg-none hover:bg-gray-100"
          )}
          type="button"
        >
          {isActive ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-blue-600 cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : (
            <Mic className="w-6 h-6 text-gray-700 stroke-2" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            isActive
              ? "text-gray-700"
              : "text-gray-400"
          )}
        >
          {formatTime(callDuration)}
        </span>

        <div className="h-8 w-80 flex items-center justify-center gap-1">
          {isActive ? (
            // Animated waveform when active
            [...Array(48)].map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-black animate-pulse transition-all duration-300"
                style={
                  isClient
                    ? {
                          height: `${30 + Math.random() * 70}%`,
                          animationDelay: `${i * 0.05}s`,
                      }
                    : undefined
                }
              />
            ))
          ) : (
            // Dotted line when idle
            <div className="flex items-center justify-center gap-1 w-full">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-gray-400 rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        <p className="h-4 text-xs text-gray-600">
          {isActive ? "Listening..." : ""}
        </p>
      </div>
    </div>
  );
}
