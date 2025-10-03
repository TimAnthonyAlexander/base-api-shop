import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme, type ThemeName } from '../themes';
import { http } from '../http';

interface ThemeContextValue {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  refetchTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>('luxury');
  const [loading, setLoading] = useState(true);

  const fetchTheme = async () => {
    try {
      const response = await http.get<{ data: { theme: ThemeName } }>('/theme');
      if (response.data?.theme) {
        setThemeNameState(response.data.theme);
      }
    } catch (error) {
      console.error('Failed to fetch theme:', error);
      // Keep default theme on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  const setThemeName = (name: ThemeName) => {
    setThemeNameState(name);
  };

  const value: ThemeContextValue = {
    themeName,
    setThemeName,
    refetchTheme: fetchTheme,
  };

  // Show nothing while loading initial theme to prevent flash
  if (loading) {
    return null;
  }

  const theme = getTheme(themeName);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

