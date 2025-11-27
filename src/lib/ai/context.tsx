'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AIState {
  isAIEnabled: boolean;
  setIsAIEnabled: (value: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
}

const AIStateContext = createContext<AIState | undefined>(undefined);

export const AIStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAIEnabled, setIsAIEnabledState] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedValue = localStorage.getItem('ai-assistant-enabled');
      if (storedValue) {
        setIsAIEnabledState(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error('Failed to parse AI assistant state from localStorage', error);
    }
  }, []);

  const setIsAIEnabled = useCallback((value: boolean) => {
    setIsAIEnabledState(value);
    if (isMounted) {
      try {
        localStorage.setItem('ai-assistant-enabled', JSON.stringify(value));
      } catch (error) {
        console.error('Failed to save AI assistant state to localStorage', error);
      }
    }
  }, [isMounted]);

  const value = { isAIEnabled, setIsAIEnabled, isSearchOpen, setIsSearchOpen };

  if (!isMounted) {
    // Return a version of the provider that doesn't render the UI on the server
    // but still provides the context, to prevent hydration errors.
    const serverValue = { ...value, isAIEnabled: false };
    return <AIStateContext.Provider value={serverValue}>{children}</AIStateContext.Provider>;
  }

  return (
    <AIStateContext.Provider value={value}>
      {children}
    </AIStateContext.Provider>
  );
};

export const useAIState = (): AIState => {
  const context = useContext(AIStateContext);
  if (context === undefined) {
    throw new Error('useAIState must be used within an AIStateProvider');
  }
  return context;
};
