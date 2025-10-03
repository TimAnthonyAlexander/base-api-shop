import { createTheme, type Theme } from '@mui/material/styles';

export type ThemeName = 'luxury' | 'ocean' | 'sunset' | 'forest' | 'monochrome';

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  description: string;
}

export const themeConfigs: ThemeConfig[] = [
  {
    name: 'luxury',
    label: 'Luxury',
    description: 'Elegant black with jewel-toned accents',
  },
  {
    name: 'ocean',
    label: 'Ocean',
    description: 'Deep blues and aqua gradients',
  },
  {
    name: 'sunset',
    label: 'Sunset',
    description: 'Warm coral and peach tones',
  },
  {
    name: 'forest',
    label: 'Forest',
    description: 'Earthy greens and natural tones',
  },
  {
    name: 'monochrome',
    label: 'Monochrome',
    description: 'Pure black and white minimalism',
  },
];

// Luxury Theme (Default/Original)
const luxuryTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
      light: '#4a4a4a',
      dark: '#000000',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '4.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
});

// Ocean Theme
const oceanTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0c4a6e',
      light: '#0369a1',
      dark: '#082f49',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#f0f9ff',
      paper: '#e0f2fe',
    },
    text: {
      primary: '#0c4a6e',
      secondary: '#0369a1',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '4rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: '14px 36px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(6, 182, 212, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 4px 20px rgba(8, 145, 178, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(8, 145, 178, 0.15)',
            transform: 'translateY(-6px)',
          },
        },
      },
    },
  },
});

// Sunset Theme
const sunsetTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ea580c',
      light: '#f97316',
      dark: '#c2410c',
    },
    secondary: {
      main: '#f472b6',
      light: '#f9a8d4',
      dark: '#ec4899',
    },
    background: {
      default: '#fff7ed',
      paper: '#ffedd5',
    },
    text: {
      primary: '#7c2d12',
      secondary: '#9a3412',
    },
  },
  typography: {
    fontFamily: '"Outfit", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '4.5rem',
      fontWeight: 800,
      letterSpacing: '-0.04em',
      lineHeight: 1.05,
    },
    h2: {
      fontSize: '3.25rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
    },
    h3: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '13px 34px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 5px 18px rgba(244, 114, 182, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #f97316 0%, #f472b6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #fb923c 0%, #f9a8d4 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 3px 18px rgba(249, 115, 22, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 36px rgba(249, 115, 22, 0.2)',
            transform: 'translateY(-5px)',
          },
        },
      },
    },
  },
});

// Forest Theme
const forestTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#14532d',
      light: '#15803d',
      dark: '#052e16',
    },
    secondary: {
      main: '#84cc16',
      light: '#a3e635',
      dark: '#65a30d',
    },
    background: {
      default: '#f7fee7',
      paper: '#ecfccb',
    },
    text: {
      primary: '#14532d',
      secondary: '#166534',
    },
  },
  typography: {
    fontFamily: '"Lora", "Georgia", "Times New Roman", serif',
    h1: {
      fontSize: '4.25rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.15,
    },
    h2: {
      fontSize: '3.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1.0625rem',
      lineHeight: 1.75,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.015em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 30px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #15803d 0%, #84cc16 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #16a34a 0%, #a3e635 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(21, 128, 61, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 28px rgba(21, 128, 61, 0.15)',
            transform: 'translateY(-3px)',
          },
        },
      },
    },
  },
});

// Monochrome Theme
const monochromeTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      light: '#404040',
      dark: '#000000',
    },
    secondary: {
      main: '#737373',
      light: '#a3a3a3',
      dark: '#525252',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#525252',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '5rem',
      fontWeight: 900,
      letterSpacing: '-0.05em',
      lineHeight: 1,
    },
    h2: {
      fontSize: '3.75rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h3: {
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '14px 40px',
          fontSize: '0.875rem',
          fontWeight: 700,
          boxShadow: 'none',
          border: '2px solid #000000',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
        contained: {
          background: '#000000',
          color: '#ffffff',
          '&:hover': {
            background: '#ffffff',
            color: '#000000',
            border: '2px solid #000000',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid #e5e5e5',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: 'none',
            border: '1px solid #000000',
            transform: 'none',
          },
        },
      },
    },
  },
});

export const themes: Record<ThemeName, Theme> = {
  luxury: luxuryTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
  monochrome: monochromeTheme,
};

export function getTheme(themeName: ThemeName): Theme {
  return themes[themeName] || themes.luxury;
}

