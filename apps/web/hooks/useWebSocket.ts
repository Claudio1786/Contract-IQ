import { useState, useEffect, useRef, useCallback } from 'react';

export interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (data: any) => void;
}

export interface WebSocketState {
  socket: WebSocket | null;
  lastMessage: any;
  readyState: number;
  isConnected: boolean;
  isConnecting: boolean;
  hasError: boolean;
}

export const useWebSocket = (options: WebSocketOptions) => {
  const [state, setState] = useState<WebSocketState>({
    socket: null,
    lastMessage: null,
    readyState: WebSocket.CONNECTING,
    isConnected: false,
    isConnecting: true,
    hasError: false
  });
  
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(true);

  const connect = useCallback(() => {
    if (state.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const socket = new WebSocket(options.url, options.protocols);

      socket.onopen = () => {
        setState(prev => ({
          ...prev,
          socket,
          readyState: WebSocket.OPEN,
          isConnected: true,
          isConnecting: false,
          hasError: false
        }));
        reconnectAttempts.current = 0;
        options.onOpen?.();
      };

      socket.onclose = () => {
        setState(prev => ({
          ...prev,
          socket: null,
          readyState: WebSocket.CLOSED,
          isConnected: false,
          isConnecting: false
        }));

        options.onClose?.();

        // Attempt to reconnect if enabled
        if (
          shouldReconnect.current &&
          (!options.maxReconnectAttempts || reconnectAttempts.current < options.maxReconnectAttempts)
        ) {
          reconnectAttempts.current++;
          reconnectTimeout.current = setTimeout(
            connect,
            options.reconnectInterval || 3000
          );
          setState(prev => ({ ...prev, isConnecting: true }));
        }
      };

      socket.onerror = (error) => {
        setState(prev => ({ ...prev, hasError: true, isConnecting: false }));
        options.onError?.(error);
      };

      socket.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          data = event.data;
        }
        
        setState(prev => ({ ...prev, lastMessage: data }));
        options.onMessage?.(data);
      };

      setState(prev => ({
        ...prev,
        socket,
        isConnecting: true,
        hasError: false
      }));
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        hasError: true, 
        isConnecting: false 
      }));
    }
  }, [options.url, options.protocols, options.reconnectInterval, options.maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (state.socket) {
      state.socket.close();
    }
  }, [state.socket]);

  const sendMessage = useCallback((data: any) => {
    if (state.socket?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      state.socket.send(message);
      return true;
    }
    return false;
  }, [state.socket]);

  useEffect(() => {
    connect();
    
    return () => {
      shouldReconnect.current = false;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (state.socket) {
        state.socket.close();
      }
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage
  };
};