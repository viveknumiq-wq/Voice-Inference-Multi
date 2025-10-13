import React, { useState, useCallback } from 'react';
import { Role } from 'ultravox-client';
import { toggleMute } from '@/lib/callFunctions';
import { MicIcon, MicOffIcon, Volume2Icon, VolumeOffIcon } from 'lucide-react';

interface MicToggleButtonProps {
  role: Role;
}

const MicToggleButton: React.FC<MicToggleButtonProps> = ({ role }) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMic = useCallback(async () => {
    try {
      toggleMute(role);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  }, [isMuted]);

  return (
    <button
      onClick={toggleMic}
      className="flex-grow flex items-center justify-center border-2 border-gray-300 bg-white text-gray-700 h-10 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200 rounded-lg"
    >
      {isMuted ? (
        <>
          { role === Role.USER ? (
            <MicOffIcon width={24} className="text-gray-700" />
          ) : (
            <VolumeOffIcon width={24} className="text-gray-700" />
          )}
          <span className="ml-2">Unmute</span>
        </>
      ) : (
        <>
          { role === Role.USER ? (
            <MicIcon width={24} className="text-gray-700" />
          ) : (
            <Volume2Icon width={24} className="text-gray-700" />
          )}

          <span className="ml-2">Mute</span>
        </>
      )}
    </button>
  );
};

export default MicToggleButton;