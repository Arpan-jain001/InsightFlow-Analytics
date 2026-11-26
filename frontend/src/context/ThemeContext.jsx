import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

/* InsightFlow ships a single light theme (coral + navy ink). */
export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);
  return <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
