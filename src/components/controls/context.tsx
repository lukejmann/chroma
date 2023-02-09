import React, { createContext, useContext } from "react";
import { useTheme } from "styled-components/macro";
import ThemeProvider, { ThemedGlobalStyle } from "theme";
import type { FullTheme } from "./styles";
import type { StoreType, PanelSettingsType, InputContextProps } from "./types";

export const InputContext = createContext({});

export function useInputContext<T = {}>() {
  return useContext(InputContext) as InputContextProps & T;
}

type ThemeContextProps = { theme: FullTheme; className: string };

export const ThemeContext = createContext<ThemeContextProps | null>(null);

export const StoreContext = createContext<StoreType | null>(null);

export const PanelSettingsContext = createContext<PanelSettingsType | null>(
  null
);

export function useStoreContext() {
  return useContext(StoreContext)!;
}

export function usePanelSettingsContext() {
  return useContext(PanelSettingsContext)!;
}

type ControlsStoreProviderProps = {
  children: React.ReactChild | React.ReactChild[] | React.ReactChildren;
  store: StoreType;
};

export function ControlsStoreProvider({
  children,
  store,
}: ControlsStoreProviderProps) {
  const theme = useTheme();
  return (
    <ThemeProvider>
      <ThemedGlobalStyle />
      {/* <App /> */}

      <StoreContext.Provider value={store}>
        {children as any}
      </StoreContext.Provider>
    </ThemeProvider>
  );
}
