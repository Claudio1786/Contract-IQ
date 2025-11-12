'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { ChatInterface } from '../../components/chat/ChatInterface';

export default function ChatPage() {
  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // TODO: Implement API call to backend
  };

  return (
    <AppShell>
      <ChatInterface 
        onSendMessage={handleSendMessage}
      />
    </AppShell>
  );
}