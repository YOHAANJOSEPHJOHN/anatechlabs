'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface WorkshopInquiryContextType {
  isOpen: boolean;
  open: (defaultWorkshop?: string) => void;
  close: () => void;
  defaultWorkshop?: string;
}

const WorkshopInquiryContext = createContext<WorkshopInquiryContextType | undefined>(undefined);

export const WorkshopInquiryProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultWorkshop, setDefaultWorkshop] = useState<string | undefined>();

  const open = useCallback((workshop?: string) => {
    setDefaultWorkshop(workshop);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setDefaultWorkshop(undefined);
  }, []);

  return (
    <WorkshopInquiryContext.Provider value={{ isOpen, open, close, defaultWorkshop }}>
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
