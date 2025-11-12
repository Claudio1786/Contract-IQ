'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Citation, FileUpload } from '../ui';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: CitationData[];
  isStreaming?: boolean;
}

export interface CitationData {
  source: string;
  content: string;
  page?: number;
  section?: string;
  confidence?: number;
}

export interface ChatInterfaceProps {
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages = [],
  onSendMessage,
  isLoading = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<CitationData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    onSendMessage?.(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (\n    <div className=\"flex flex-col h-full\">\n      {/* Chat Header */}\n      <div className=\"bg-white border-b border-gray-200 p-4\">\n        <div className=\"flex items-center justify-between\">\n          <div>\n            <h2 className=\"text-lg font-semibold text-gray-900\">Contract Analysis</h2>\n            <p className=\"text-sm text-gray-500\">Ask questions about your contracts</p>\n          </div>\n          <Button variant=\"secondary\" size=\"sm\">\n            📤 Upload Contract\n          </Button>\n        </div>\n      </div>\n\n      {/* Messages Area */}\n      <div className=\"flex-1 overflow-y-auto p-4 space-y-4\">\n        {messages.length === 0 ? (\n          <WelcomeScreen />\n        ) : (\n          messages.map((message) => (\n            <MessageBubble\n              key={message.id}\n              message={message}\n              onCitationClick={setSelectedCitation}\n            />\n          ))\n        )}\n        \n        {isLoading && (\n          <div className=\"flex justify-start\">\n            <Card className=\"max-w-2xl bg-gray-50\">\n              <div className=\"flex items-center space-x-2 p-3\">\n                <div className=\"flex space-x-1\">\n                  <div className=\"w-2 h-2 bg-gray-400 rounded-full animate-bounce\" />\n                  <div className=\"w-2 h-2 bg-gray-400 rounded-full animate-bounce\" style={{ animationDelay: '0.1s' }} />\n                  <div className=\"w-2 h-2 bg-gray-400 rounded-full animate-bounce\" style={{ animationDelay: '0.2s' }} />\n                </div>\n                <span className=\"text-sm text-gray-600\">Analyzing...</span>\n              </div>\n            </Card>\n          </div>\n        )}\n        \n        <div ref={messagesEndRef} />\n      </div>\n\n      {/* Input Area */}\n      <div className=\"bg-white border-t border-gray-200 p-4\">\n        <div className=\"flex space-x-3\">\n          <div className=\"flex-1\">\n            <Input\n              value={inputValue}\n              onChange={(e) => setInputValue(e.target.value)}\n              onKeyPress={handleKeyPress}\n              placeholder=\"Ask about contract terms, risks, or negotiation strategies...\"\n              disabled={isLoading}\n              size=\"lg\"\n            />\n          </div>\n          <Button\n            onClick={handleSendMessage}\n            disabled={!inputValue.trim() || isLoading}\n            loading={isLoading}\n            size=\"lg\"\n          >\n            Send\n          </Button>\n        </div>\n        <p className=\"text-xs text-gray-500 mt-2\">\n          💡 Try: \"What are the key risks in this contract?\" or \"Suggest negotiation points for liability terms\"\n        </p>\n      </div>\n\n      {/* Citation Preview Modal */}\n      {selectedCitation && (\n        <CitationPreview\n          citation={selectedCitation}\n          onClose={() => setSelectedCitation(null)}\n        />\n      )}\n    </div>\n  );\n};\n\ninterface MessageBubbleProps {\n  message: ChatMessage;\n  onCitationClick: (citation: CitationData) => void;\n}\n\nconst MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCitationClick }) => {\n  const isUser = message.type === 'user';\n  \n  return (\n    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>\n      <Card \n        className={`\n          max-w-2xl \n          ${isUser \n            ? 'bg-blue-600 text-white' \n            : 'bg-white border border-gray-200'\n          }\n        `}\n        padding=\"md\"\n      >\n        <div className=\"space-y-2\">\n          <div className={`text-sm ${isUser ? 'text-white' : 'text-gray-900'}`}>\n            {message.content}\n          </div>\n          \n          {message.citations && message.citations.length > 0 && (\n            <div className=\"flex flex-wrap gap-1 mt-2\">\n              {message.citations.map((citation, index) => (\n                <Citation\n                  key={index}\n                  source={citation.source}\n                  content={citation.content}\n                  page={citation.page}\n                  section={citation.section}\n                  confidence={citation.confidence}\n                  onPreview={onCitationClick}\n                  size=\"sm\"\n                />\n              ))}\n            </div>\n          )}\n          \n          <div className={`text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>\n            {message.timestamp.toLocaleTimeString()}\n          </div>\n        </div>\n      </Card>\n    </div>\n  );\n};\n\nconst WelcomeScreen: React.FC = () => (\n  <div className=\"flex flex-col items-center justify-center h-full text-center space-y-6\">\n    <div className=\"w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center\">\n      <span className=\"text-2xl\">🤝</span>\n    </div>\n    \n    <div className=\"space-y-2\">\n      <h3 className=\"text-xl font-semibold text-gray-900\">\n        Welcome to Contract IQ Chat\n      </h3>\n      <p className=\"text-gray-600 max-w-md\">\n        Upload a contract or ask me questions about contract terms, risks, and negotiation strategies.\n      </p>\n    </div>\n    \n    <div className=\"grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl\">\n      <SuggestionCard\n        icon=\"⚖️\"\n        title=\"Risk Analysis\"\n        description=\"Identify potential risks and liability issues\"\n      />\n      <SuggestionCard\n        icon=\"💰\"\n        title=\"Cost Optimization\"\n        description=\"Find opportunities to reduce costs\"\n      />\n      <SuggestionCard\n        icon=\"🎯\"\n        title=\"Negotiation Points\"\n        description=\"Get strategic talking points\"\n      />\n      <SuggestionCard\n        icon=\"📊\"\n        title=\"Benchmarking\"\n        description=\"Compare against industry standards\"\n      />\n    </div>\n  </div>\n);\n\ninterface SuggestionCardProps {\n  icon: string;\n  title: string;\n  description: string;\n}\n\nconst SuggestionCard: React.FC<SuggestionCardProps> = ({ icon, title, description }) => (\n  <Card variant=\"interactive\" className=\"p-4 cursor-pointer\">\n    <div className=\"flex items-start space-x-3\">\n      <span className=\"text-xl\">{icon}</span>\n      <div>\n        <h4 className=\"font-medium text-gray-900\">{title}</h4>\n        <p className=\"text-sm text-gray-600\">{description}</p>\n      </div>\n    </div>\n  </Card>\n);\n\ninterface CitationPreviewProps {\n  citation: CitationData;\n  onClose: () => void;\n}\n\nconst CitationPreview: React.FC<CitationPreviewProps> = ({ citation, onClose }) => (\n  <div className=\"fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4\">\n    <Card className=\"max-w-2xl w-full max-h-[80vh] overflow-y-auto\">\n      <div className=\"p-4 border-b border-gray-200\">\n        <div className=\"flex justify-between items-start\">\n          <div>\n            <h3 className=\"text-lg font-semibold text-gray-900\">{citation.source}</h3>\n            <div className=\"text-sm text-gray-500\">\n              {citation.page && `Page ${citation.page}`}\n              {citation.section && ` • Section ${citation.section}`}\n              {citation.confidence && ` • ${Math.round(citation.confidence * 100)}% confidence`}\n            </div>\n          </div>\n          <Button variant=\"ghost\" size=\"sm\" onClick={onClose}>\n            ✕\n          </Button>\n        </div>\n      </div>\n      \n      <div className=\"p-4\">\n        <p className=\"text-gray-700 whitespace-pre-wrap\">{citation.content}</p>\n      </div>\n    </Card>\n  </div>\n);