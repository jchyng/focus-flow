'use client';

import { createContext, useContext, useState } from 'react';

const ModalContext = createContext<{
  name: string | null;
  open: (name: string) => void;
  close: () => void;
}>({
  name: '',
  open: () => {},
  close: () => {},
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState<string | null>(null);

  const open = (name: string) => setName(name);
  const close = () => setName(null);

  return (
    <ModalContext.Provider
      value={{
        name,
        open,
        close,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
