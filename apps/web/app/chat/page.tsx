'use client';

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { ChatInterface } from '../../components/chat/ChatInterface';
import { useChat } from '../../hooks/useChat';

export default function ChatPage() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    uploadContract,
  } = useChat({
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  return (
    <AppLayout>
      <ChatInterface 
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-sm">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </AppLayout>
  );
}