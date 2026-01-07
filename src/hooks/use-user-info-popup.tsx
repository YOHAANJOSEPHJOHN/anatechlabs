'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface UserInfoPopupContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  userInfoPopupsEnabled: boolean;
  setUserInfoPopupsEnabled: (enabled: boolean) => void;
}

const UserInfoPopupContext = createContext<UserInfoPopupContextType | undefined>(undefined);

export const UserInfoPopupProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfoPopupsEnabled, setUserInfoPopupsEnabledState] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedValue = localStorage.getItem('enableUserInfoPopups');
      if (storedValue !== null) {
        setUserInfoPopupsEnabledState(JSON.parse(storedValue));
      } else {
        // Set default on first load
        localStorage.setItem('enableUserInfoPopups', JSON.stringify(true));
        setUserInfoPopupsEnabledState(true);
      }
    } catch (error) {
      console.error('Failed to access localStorage for user info pop-up state', error);
      setUserInfoPopupsEnabledState(true); // Default to true on error
    }
  }, []);

  const open = useCallback(() => {
    if (userInfoPopupsEnabled) {
      // Check if user info already exists
      try {
        const existingInfo = localStorage.getItem('userInfo');
        if (!existingInfo) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Failed to access localStorage for user info', error);
        setIsOpen(true); // Open if we can't check
      }
    }
  }, [userInfoPopupsEnabled]);

  const close = useCallback(() => setIsOpen(false), []);

  const setUserInfoPopupsEnabled = useCallback((enabled: boolean) => {
    setUserInfoPopupsEnabledState(enabled);
    if (isMounted) {
      try {
        localStorage.setItem('enableUserInfoPopups', JSON.stringify(enabled));
      } catch (error) {
        console.error('Failed to save user info pop-up state to localStorage', error);
      }
    }
  }, [isMounted]);

  const value = { isOpen, open, close, userInfoPopupsEnabled, setUserInfoPopupsEnabled };

  return (
    <UserInfoPopupContext.Provider value={value}>
      {children}
    </UserInfoPopupContext.Provider>
  );
};

export const useUserInfoPopup = () => {
  const context = useContext(UserInfoPopupContext);
  if (context === undefined) {
    throw new Error('useUserInfoPopup must be used within a UserInfoPopupProvider');
  }
  return context;
};

    