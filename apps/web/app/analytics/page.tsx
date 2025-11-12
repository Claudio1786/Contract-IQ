'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { AnalyticsCards, generateMockAnalyticsData, AnalyticsData } from '../../components/analytics/AnalyticsCards';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { Button } from '../../components/ui';
import { useChat } from '../../hooks/useChat';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const {
    messages,
    isLoading: chatLoading,
    error,
    sendMessage,
  } = useChat();

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(generateMockAnalyticsData());
      setIsLoading(false);
    };

    loadAnalytics();
  }, []);

  const handleAnalyticsQuery = (message: string) => {
    // Add analytics context to the message
    const contextualMessage = `Based on my contract portfolio analytics: ${message}`;
    sendMessage(contextualMessage);
  };

  const suggestedQuestions = [
    "What's driving my risk score up?",
    "Which contracts should I prioritize for renewal?",
    "How can I reduce my monthly spend?",
    "What negotiation opportunities do you see?",
    "Are there any red flags in my high-risk contracts?",
    "Show me cost optimization opportunities"
  ];

  if (isLoading || !analyticsData) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row h-full">
        {/* Analytics Panel */}
        <div className={`${showChat ? 'lg:w-2/3 w-full' : 'w-full'} transition-all duration-300`}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between">
              <div>
                <h1 className="text-base sm:text-lg font-semibold text-gray-900">
                  Portfolio Analytics
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Contract intelligence and insights from your portfolio
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={showChat ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => setShowChat(!showChat)}
                  className="text-xs sm:text-sm"
                >
                  {showChat ? '📊 Focus' : '💬 Chat'}
                  <span className="hidden sm:inline ml-1">
                    {showChat ? 'Analytics' : 'AI Assistant'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Analytics Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <AnalyticsCards data={analyticsData} />
              
              {/* Insights Summary */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">📈 Key Insights</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Your average risk score has improved by 0.3 points this month</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-600">⚠</span>
                    <span>8 contracts are due for renewal in the next 90 days</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">💡</span>
                    <span>$125K in potential savings identified across SaaS agreements</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-600">🎯</span>
                    <span>Focus on renegotiating service contracts for maximum impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel - Mobile slides over, desktop sidebar */}
        {showChat && (
          <div className={`
            lg:w-1/3 lg:border-l lg:border-gray-200 lg:relative 
            fixed lg:static inset-0 lg:inset-auto z-40 lg:z-auto
            bg-white lg:bg-transparent
          `}>
            {/* Mobile backdrop */}
            <div className="lg:hidden absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowChat(false)} />
            
            {/* Chat panel content */}
            <div className="lg:h-full h-screen flex flex-col bg-white lg:relative absolute right-0 lg:right-auto w-full max-w-sm lg:max-w-none">
              <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Analytics Assistant</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Ask questions about your portfolio data
                    </p>
                  </div>
                  {/* Mobile close button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowChat(false)}
                    className="lg:hidden"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              
              {/* Suggested Questions */}
              {messages.length === 0 && (
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                  <div className="text-xs font-medium text-gray-700 mb-2">💡 Try asking:</div>
                  <div className="space-y-1">
                    {suggestedQuestions.slice(0, 3).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnalyticsQuery(question)}
                        className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                      >
                        "{question}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <ChatInterface
                  messages={messages}
                  isLoading={chatLoading}
                  onSendMessage={handleAnalyticsQuery}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}