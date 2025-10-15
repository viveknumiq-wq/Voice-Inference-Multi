'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation'; 
import { startCall, endCall } from '@/lib/callFunctions'
import { CallConfig, SelectedTool } from '@/lib/types'
import { useCases, getSystemPromptForLanguage, SupportedLanguage } from '../demo-config';
import { Role, Transcript, UltravoxExperimentalMessageEvent, UltravoxSessionStatus } from 'ultravox-client';
import BorderedImage from '@/app/components/BorderedImage';
import UVLogo from '@/public/UVMark-White.svg';
import CallStatus from '../components/CallStatus';
import DebugMessages from '@/app/components/DebugMessages';
import MicToggleButton from '../components/MicToggleButton';
import { PhoneOffIcon } from 'lucide-react';
import OrderDetails from '../components/OrderDetails';
import MicrophoneAnimation from '../components/MicrophoneAnimation';
import LanguageSelector from '../components/LanguageSelector';

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

export default function UseCasePage() {
  const params = useParams();
  const useCase = params.useCase as string;
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>('off');
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
  const [callDebugMessages, setCallDebugMessages] = useState<UltravoxExperimentalMessageEvent[]>([]);
  const [customerProfileKey, setCustomerProfileKey] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [callDuration, setCallDuration] = useState(0);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  
  // Get the configuration for the current use case
  const currentConfig = useCases[useCase as keyof typeof useCases] || useCases.airline;
  
  // Debug logging
  console.log('Current useCase:', useCase);
  console.log('Current config:', currentConfig);
  
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

  const handleLanguageChange = useCallback((newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
  }, []);

  const handleStartCallButtonClick = async (modelOverride?: string, showDebugMessages?: boolean) => {
    try {
      console.log('Starting call...');
      handleStatusChange('Starting call...');
      setCallTranscript(null);
      setCallDebugMessages([]);
      clearCustomerProfile();

      // Generate a new key for the customer profile
      const newKey = `call-${Date.now()}`;
      setCustomerProfileKey(newKey);

      // Setup our call config including the call key as a parameter restriction
      let callConfig: CallConfig = {
        systemPrompt: getSystemPromptForLanguage(language, useCase),
        model: modelOverride || currentConfig.callConfig.model,
        languageHint: currentConfig.callConfig.languageHint,
        voice: currentConfig.callConfig.voice,
        temperature: currentConfig.callConfig.temperature,
        maxDuration: currentConfig.callConfig.maxDuration,
        timeExceededMessage: currentConfig.callConfig.timeExceededMessage
      };

      console.log('Call config:', callConfig);

      const paramOverride: { [key: string]: any } = {
        "callId": newKey
      }

      let cpTool: SelectedTool | undefined = currentConfig?.callConfig?.selectedTools?.find(tool => tool.toolName === "createProfile");
      
      if (cpTool) {
        cpTool.parameterOverrides = paramOverride;
      }
      callConfig.selectedTools = currentConfig.callConfig.selectedTools;

      console.log('About to call startCall...');
      await startCall({
        onStatusChange: handleStatusChange,
        onTranscriptChange: handleTranscriptChange,
        onDebugMessage: handleDebugMessage
      }, callConfig, showDebugMessages);

      console.log('Call started successfully');
      setIsCallActive(true);
      handleStatusChange('Call started successfully');
    } catch (error) {
      console.error('Error starting call:', error);
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
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">{currentConfig.title}</h1>
                <p className="text-lg text-gray-600">{currentConfig.overview}</p>
              </div>
              
              {/* Main Container */}
              <div className="max-w-[1206px] mx-auto w-full">
                {/* Language Selector Header */}
                <div className="mb-6">
                  <LanguageSelector 
                    currentLanguage={language} 
                    onLanguageChange={handleLanguageChange} 
                  />
                </div>
                
                {/* Main Content Card */}
                <div className="border border-gray-300 rounded-2xl bg-white shadow-2xl shadow-blue-200/50 overflow-hidden">
                  <div className="flex flex-col lg:flex-row min-h-[600px]">
                    {/* Left Section - Voice Interface */}
                    <div className="w-full lg:w-2/3 p-8 flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-white">
                      <div className="w-full max-w-lg">
                        {isCallActive ? (
                          <div className="space-y-8">
                            {/* Microphone Animation - Active State */}
                            <div className="flex justify-center">
                              <MicrophoneAnimation isActive={isCallActive} callDuration={callDuration} />
                            </div>
                            
                            {/* Control Buttons */}
                            <div className="space-y-4">
                              <div className="flex justify-center space-x-4">
                                <MicToggleButton role={Role.USER}/>
                                { showMuteSpeakerButton && <MicToggleButton role={Role.AGENT}/> }
                              </div>
                              <button
                                type="button"
                                className="flex items-center justify-center h-12 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg w-full transition-colors"
                                onClick={handleEndCallButtonClick}
                                disabled={!isCallActive}
                              >
                                <PhoneOffIcon width={24} className="mr-2" />
                                End Call
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-8">
                            {/* Microphone Animation - Idle State */}
                            <div className="flex justify-center">
                              <MicrophoneAnimation isActive={false} callDuration={0} />
                            </div>
                            
                            {/* Start Call Button */}
                            <button
                              type="button"
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                              onClick={() => {
                                console.log('Start Call button clicked!');
                                handleStartCallButtonClick(modelOverride, showDebugMessages);
                              }}
                            >
                              Start Call
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Right Section - Call Status */}
                    <div className="w-full lg:w-1/3 bg-gray-900">
                      <CallStatus status={agentStatus} isCallActive={isCallActive} callDuration={callDuration} />
                    </div>
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
