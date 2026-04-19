"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PublicPageReadyContextValue = {
  ready: boolean;
  setReady: (value: boolean) => void;
};

const PublicPageReadyContext = createContext<PublicPageReadyContextValue>({
  // Safe fallback outside provider.
  ready: true,
  setReady: () => {},
});

export function PublicPageReadyProvider({ children }: { children: ReactNode }) {
  const [ready, setReadyState] = useState(false);

  const setReady = useCallback((value: boolean) => {
    setReadyState(value);
  }, []);

  const contextValue = useMemo(
    () => ({ ready, setReady }),
    [ready, setReady],
  );

  return (
    <PublicPageReadyContext.Provider value={contextValue}>
      {children}
    </PublicPageReadyContext.Provider>
  );
}

export function usePublicPageReady() {
  return useContext(PublicPageReadyContext);
}
