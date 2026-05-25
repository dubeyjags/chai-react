import React, { createContext, useState } from "react";

export const ThemeContext = createContext({
  isDark: true,
  setLight: () => {},
});

export function ThemeContextProvider({ children }) {
  const [isDark, setLight] = useState(true);
  return (
    <ThemeContext.Provider value={{ isDark, setLight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function useTheme() {
  return React.useContext(ThemeContext);
}