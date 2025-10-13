'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { startCall, endCall } from '@/lib/callFunctions'
import { CallConfig, SelectedTool } from '@/lib/types'
import demoConfig, { getSystemPromptForLanguage } from './demo-config';
import { Role, Transcript, UltravoxExperimentalMessageEvent, UltravoxSessionStatus } from 'ultravox-client';
import BorderedImage from '@/app/components/BorderedImage';
import UVLogo from '@/public/UVMark-White.svg';
import CallStatus from './components/CallStatus';
import DebugMessages from '@/app/components/DebugMessages';
import MicToggleButton from './components/MicToggleButton';
import { PhoneOffIcon } from 'lucide-react';
import OrderDetails from './components/OrderDetails';
import MicrophoneAnimation from './components/MicrophoneAnimation';

type SearchParamsProps = {
  showMuteSpeakerButton: boolean;
  modelOverride: string | undefined;
  showDebugMessages: boolean;
  showUserTranscripts: boolean;
};

type SearchParamsHandlerProps = {
  children: (props: SearchParamsProps) => React.ReactNode;
};

function SearchParamsHandler({ children }: SearchParamsHandlerProps) {
  // Process query params to see if we want to change the behavior for showing speaker mute button or changing the model
  const searchParams = useSearchParams();
  const showMuteSpeakerButton = searchParams.get('showSpeakerMute') === 'true';
  const showDebugMessages = searchParams.get('showDebugMessages') === 'true';
  const showUserTranscripts = searchParams.get('showUserTranscripts') === 'true';
  let modelOverride: string | undefined;
  
  if (searchParams.get('model')) {
    modelOverride = "fixie-ai/" + searchParams.get('model');
  }

  return children({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts });
}

export default function Home() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('off');
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
  const [callDebugMessages, setCallDebugMessages] = useState<UltravoxExperimentalMessageEvent[]>([]);
  const [customerProfileKey, setCustomerProfileKey] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en'>('en');
  const [callDuration, setCallDuration] = useState(0);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [callTranscript]);

  // Call duration timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isCallActive) {
      intervalId = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => clearInterval(intervalId);
  }, [isCallActive]);

  const handleStatusChange = useCallback((status: UltravoxSessionStatus | string | undefined) => {
    if(status) {
      setAgentStatus(status);
    } else {
      setAgentStatus('off');
    }
    
  }, []);

  const handleTranscriptChange = useCallback((transcripts: Transcript[] | undefined) => {
    if(transcripts) {
      setCallTranscript([...transcripts]);
    }
  }, []);

  const handleDebugMessage = useCallback((debugMessage: UltravoxExperimentalMessageEvent) => {
    setCallDebugMessages(prevMessages => [...prevMessages, debugMessage]);
  }, []);

  const clearCustomerProfile = useCallback(() => {
    // This will trigger a re-render of CustomerProfileForm with a new empty profile
    setCustomerProfileKey(prev => prev ? `${prev}-cleared` : 'cleared');
  }, []);

  const handleStartCallButtonClick = async (modelOverride?: string, showDebugMessages?: boolean) => {
    try {
      handleStatusChange('Starting call...');
      setCallTranscript(null);
      setCallDebugMessages([]);
      clearCustomerProfile();

      // Generate a new key for the customer profile
      const newKey = `call-${Date.now()}`;
      setCustomerProfileKey(newKey);

      // Setup our call config including the call key as a parameter restriction
      let callConfig: CallConfig = {
        systemPrompt: getSystemPromptForLanguage(language),
        model: modelOverride || demoConfig.callConfig.model,
        languageHint: language,
        voice: demoConfig.callConfig.voice,
        temperature: demoConfig.callConfig.temperature,
        maxDuration: demoConfig.callConfig.maxDuration,
        timeExceededMessage: demoConfig.callConfig.timeExceededMessage
      };

      const paramOverride: { [key: string]: any } = {
        "callId": newKey
      }

      let cpTool: SelectedTool | undefined = demoConfig?.callConfig?.selectedTools?.find(tool => tool.toolName === "createProfile");
      
      if (cpTool) {
        cpTool.parameterOverrides = paramOverride;
      }
      callConfig.selectedTools = demoConfig.callConfig.selectedTools;

      await startCall({
        onStatusChange: handleStatusChange,
        onTranscriptChange: handleTranscriptChange,
        onDebugMessage: handleDebugMessage
      }, callConfig, showDebugMessages);

      setIsCallActive(true);
      handleStatusChange('Call started successfully');
    } catch (error) {
      handleStatusChange(`Error starting call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEndCallButtonClick = async () => {
    try {
      handleStatusChange('Ending call...');
      await endCall();
      setIsCallActive(false);

      clearCustomerProfile();
      setCustomerProfileKey(null);
      handleStatusChange('Call ended successfully');
    } catch (error) {
      handleStatusChange(`Error ending call: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsHandler>
        {({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts }: SearchParamsProps) => (
          <div className="min-h-screen w-full bg-white relative overflow-hidden">
            {/* Light Sky Blue Glow */}
            <div 
              className="absolute inset-0 z-0 pointer-events-none" 
              style={{
                backgroundImage: `
                  radial-gradient(circle at center, #93c5fd, transparent)
                `,
              }} 
            />
            {/* Your Content Here */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
              {/* Title and Subtitle */}
              <div className="text-center mb-8">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Experience the Future of Air Travel</h1>
                <p className="text-lg text-gray-600">AI-powered voice assistant for seamless flight bookings and customer support</p>
              </div>
              
              {/* Main Area */}
              <div className="max-w-[1206px] mx-auto w-full py-5 pl-5 pr-[10px] border border-gray-300 rounded-2xl bg-white shadow-2xl shadow-blue-200/50 h-[600px]">
              <div className="flex flex-col justify-between lg:flex-row h-full">
                {/* Action Area */}
                <div className="w-full lg:w-2/3 flex flex-col justify-center">
                  <div className="flex flex-col justify-center items-center h-full font-mono p-6">
                   
                    {isCallActive ? (
                      <div className="w-full max-w-lg">
                        
                        {/* Microphone Animation - Centered */}
                        <div className="flex justify-center mb-8">
                          <MicrophoneAnimation isActive={isCallActive} callDuration={callDuration} />
                        </div>
                        
                        <div className="flex flex-col space-y-4 w-full">
                          <div className="flex justify-center space-x-4">
                            <MicToggleButton role={Role.USER}/>
                            { showMuteSpeakerButton && <MicToggleButton role={Role.AGENT}/> }
                          </div>
                          <button
                            type="button"
                            className="flex items-center justify-center h-10 bg-red-500 w-full"
                            onClick={handleEndCallButtonClick}
                            disabled={!isCallActive}
                          >
                            <PhoneOffIcon width={24} className="text-white" />
                            <span className="ml-2">End Call</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-lg">
                        {/* Microphone Animation - Idle State */}
                        <div className="flex justify-center mb-12">
                          <MicrophoneAnimation isActive={false} callDuration={0} />
                        </div>
                        
                        <button
                          type="button"
                          className="hover:bg-gray-200 px-6 py-2 border-2 border-gray-300 w-full mb-4"
                          onClick={() => handleStartCallButtonClick(modelOverride, showDebugMessages)}
                        >
                          Start Call
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Call Status */}
                <div className="w-full lg:w-1/3 h-full">
                  <CallStatus status={agentStatus} isCallActive={isCallActive} callDuration={callDuration} />
                </div>
              </div>
            </div>
            {/* Debug View */}
            {/* <DebugMessages debugMessages={callDebugMessages} /> */}
            </div>
          </div>
        )}
      </SearchParamsHandler>
    </Suspense>
  )
}