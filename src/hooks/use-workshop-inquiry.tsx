'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface WorkshopInquiryContextType {
  isOpen: boolean;
  open: (defaultWorkshop?: string) => void;
  close: () => void;
  defaultWorkshop?: string;
  popupsEnabled: boolean;
  setPopupsEnabled: (enabled: boolean) => void;
}

const WorkshopInquiryContext = createContext<WorkshopInquiryContextType | undefined>(undefined);

export const WorkshopInquiryProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultWorkshop, setDefaultWorkshop] = useState<string | undefined>();
  const [popupsEnabled, setPopupsEnabledState] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedValue = localStorage.getItem('workshop-popups-enabled');
      if (storedValue !== null) {
        setPopupsEnabledState(JSON.parse(storedValue));
      } else {
        setPopupsEnabledState(true); // Default to on
      }
    } catch (error) {
      console.error('Failed to parse workshop pop-up state from localStorage', error);
      setPopupsEnabledState(true);
    }
  }, []);

  const setPopupsEnabled = useCallback((enabled: boolean) => {
    setPopupsEnabledState(enabled);
    if (isMounted) {
      try {
        localStorage.setItem('workshop-popups-enabled', JSON.stringify(enabled));
      } catch (error) {
        console.error('Failed to save workshop pop-up state to localStorage', error);
      }
    }
  }, [isMounted]);

  const open = useCallback((workshop?: string) => {
    setDefaultWorkshop(workshop);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setDefaultWorkshop(undefined);
  }, []);
  
  const value = { isOpen, open, close, defaultWorkshop, popupsEnabled, setPopupsEnabled };

  if (!isMounted) {
    const serverValue = { ...value, popupsEnabled: true };
    return <WorkshopInquiryContext.Provider value={serverValue}>{children}</WorkshopInquiryContext.Provider>;
  }


  return (
    <WorkshopInquiryContext.Provider value={value}>
      {children}
    </WorkshopInquiryContext.Provider>
  );
};

export const useWorkshopInquiry = () => {
  const context = useContext(WorkshopInquiryContext);
  if (context === undefined) {
    throw new Error('useWorkshopInquiry must be used within a WorkshopInquiryProvider');
  }
  return context;
};
