import React, { ReactNode, useState, useEffect } from 'react';

interface CallStatusProps {
  status: string;
  isCallActive?: boolean;
  callDuration?: number;
  children?: ReactNode;
}

const CallStatus: React.FC<CallStatusProps> = ({ status, isCallActive, callDuration = 0, children }) => {

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-white flex-col bg-[#121212] border border-[#2A2A2A] rounded-2xl p-4 w-full h-full">
      <div className="mt-2">
        <h2 className="text-xl font-semibold mb-2">Call Status</h2>
        <p className="text-lg font-mono text-gray-400">Status: <span className="text-white text-base">{status}</span></p>
        {isCallActive && (
          <p className="font-mono text-gray-400 mt-2">Duration: <span className="text-white text-base">{formatTime(callDuration)}</span></p>
        )}
      </div>

      {/* Optional Children */}
      {children}
    </div>
  );
};

export default CallStatus;