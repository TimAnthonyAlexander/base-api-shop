import { createTheme, type Theme } from '@mui/material/styles';

export type ThemeName = 'luxury' | 'monochrome' | 'noir' | 'graphite' | 'platinum' | 'eink';

export interface ThemeConfig {
    name: ThemeName;
    label: string;
    description: string;
}

export const themeConfigs: ThemeConfig[] = [
    { name: 'luxury', label: 'Luxury', description: 'Elegant black with jewel-toned accents' },
    { name: 'monochrome', label: 'Monochrome', description: 'Pure black and white minimalism' },
    { name: 'noir', label: 'Noir (Dark)', description: 'True-black OLED dark with crisp contrast' },
    { name: 'graphite', label: 'Graphite (Dark)', description: 'Soft dark gray with muted neutrals' },
    { name: 'platinum', label: 'Platinum', description: 'Neutral light with precise dividers' },
    { name: 'eink', label: 'E-Ink', description: 'Paper-like off-white with calm grays' },
];

/* ─────────────────────────────────────────────────────────
   Keep: Luxury + Monochrome (as provided)
───────────────────────────────────────────────────────── */

const luxuryTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1a1a1a', light: '#4a4a4a', dark: '#000000' },
        secondary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
        background: { default: '#ffffff', paper: '#fafafa' },
        text: { primary: '#1a1a1a', secondary: '#6b7280' },
    },
    typography: {
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        h1: { fontSize: '4.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
        h2: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 },
        h3: { fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 },
        h4: { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.4 },
        h5: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
        h6: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
        body1: { fontSize: '1rem', lineHeight: 1.7 },
        button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '12px 32px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                },
                contained: {
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
                    transition: 'all .3s cubic-bezier(.4,0,.2,1)',
                    '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.08)', transform: 'translateY(-4px)' },
                },
            },
        },
    },
});

const monochromeTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#000000', light: '#404040', dark: '#000000' },
        secondary: { main: '#737373', light: '#a3a3a3', dark: '#525252' },
        background: { default: '#ffffff', paper: '#f5f5f5' },
        text: { primary: '#000000', secondary: '#525252' },
    },
    typography: {
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        h1: { fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 },
        h2: { fontSize: '3.75rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 },
        h3: { fontSize: '2.75rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
        h4: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 },
        h5: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.4 },
        body1: { fontSize: '1rem', lineHeight: 1.6 },
        button: { textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' },
    },
    shape: { borderRadius: 0 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    padding: '14px 40px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    boxShadow: 'none',
                    border: '2px solid #000',
                    '&:hover': { boxShadow: 'none', backgroundColor: '#000', color: '#fff' },
                },
                contained: {
                    background: '#000',
                    color: '#fff',
                    '&:hover': { background: '#fff', color: '#000', border: '2px solid #000' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    boxShadow: 'none',
                    border: '1px solid #e5e5e5',
                    transition: 'all .2s ease',
                    '&:hover': { boxShadow: 'none', border: '1px solid #000', transform: 'none' },
                },
            },
        },
    },
});

/* ─────────────────────────────────────────────────────────
   New neutrals-first, shadowless, ultra-modern themes
───────────────────────────────────────────────────────── */

const baseNoShadow = {
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: { textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
            },
        },
        MuiPaper: { styleOverrides: { root: { boxShadow: 'none' } } },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'background-color .2s ease, border-color .2s ease',
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    textTransform: 'none',
                    borderRadius: 10,
                    padding: '12px 28px',
                    '&:hover': { boxShadow: 'none' },
                },
                contained: { '&:hover': {} },
            },
        },
        MuiAppBar: { defaultProps: { elevation: 0 } },
        MuiPopover: { defaultProps: { elevation: 0 } },
        MuiMenu: { defaultProps: { elevation: 0 } },
        MuiTooltip: { defaultProps: { arrow: true } },
    },
};

/* Noir: true dark, OLED-friendly */
const noirTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: '#000000', paper: '#0a0a0a' },
        primary: { main: '#e5e5e5', light: '#fafafa', dark: '#cfcfcf' },
        secondary: { main: '#a3a3a3', light: '#d4d4d4', dark: '#737373' },
        text: { primary: '#fafafa', secondary: '#a1a1aa' },
        divider: 'rgba(255,255,255,0.08)',
    },
    typography: {
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Arial, sans-serif',
        h1: { fontSize: '3.75rem', fontWeight: 800, letterSpacing: '-0.03em' },
        h2: { fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.02em' },
        h3: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
        body1: { fontSize: '1rem', lineHeight: 1.7 },
        button: { fontWeight: 600, letterSpacing: '.01em' },
    },
    shape: { borderRadius: 12 },
    ...baseNoShadow,
    components: {
        ...baseNoShadow.components,
        MuiButton: {
            ...baseNoShadow.components.MuiButton,
            styleOverrides: {
                ...baseNoShadow.components.MuiButton!.styleOverrides!,
                contained: {
                    backgroundColor: '#111111',
                    color: '#fafafa',
                    border: '1px solid rgba(255,255,255,0.08)',
                    '&:hover': { backgroundColor: '#171717', borderColor: 'rgba(255,255,255,0.12)' },
                },
                outlined: {
                    borderColor: 'rgba(255,255,255,0.16)',
                    color: '#e5e5e5',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.28)', backgroundColor: '#0f0f0f' },
                },
            },
        },
    },
});

/* Graphite: dim dark with soft contrast */
const graphiteTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: '#0b0b0c', paper: '#121214' },
        primary: { main: '#d1d5db', light: '#e5e7eb', dark: '#9ca3af' },
        secondary: { main: '#9ca3af', light: '#b0b7bf', dark: '#6b7280' },
        text: { primary: '#e5e7eb', secondary: '#9ca3af' },
        divider: 'rgba(255,255,255,0.10)',
    },
    typography: {
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Arial, sans-serif',
        h1: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
        h2: { fontSize: '2.75rem', fontWeight: 700 },
        h3: { fontSize: '2rem', fontWeight: 600 },
        body1: { fontSize: '1rem', lineHeight: 1.65 },
        button: { fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    ...baseNoShadow,
    components: {
        ...baseNoShadow.components,
        MuiButton: {
            ...baseNoShadow.components.MuiButton,
            styleOverrides: {
                ...baseNoShadow.components.MuiButton!.styleOverrides!,
                contained: {
                    backgroundColor: '#1a1b1e',
                    color: '#e5e7eb',
                    border: '1px solid rgba(255,255,255,0.08)',
                    '&:hover': { backgroundColor: '#202226', borderColor: 'rgba(255,255,255,0.14)' },
                },
                outlined: {
                    borderColor: 'rgba(255,255,255,0.14)',
                    color: '#d1d5db',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.24)', backgroundColor: '#151619' },
                },
            },
        },
    },
});

/* Platinum: neutral light with crisp dividers */
const platinumTheme = createTheme({
    palette: {
        mode: 'light',
        background: { default: '#fbfbfb', paper: '#f7f7f7' },
        primary: { main: '#1f1f1f', light: '#3a3a3a', dark: '#0f0f0f' },
        secondary: { main: '#6b6b6b', light: '#8a8a8a', dark: '#4d4d4d' },
        text: { primary: '#111111', secondary: '#5f6368' },
        divider: 'rgba(0,0,0,0.10)',
    },
    typography: {
        fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Arial, sans-serif',
        h1: { fontSize: '3.75rem', fontWeight: 800, letterSpacing: '-0.02em' },
        h2: { fontSize: '3rem', fontWeight: 700 },
        h3: { fontSize: '2rem', fontWeight: 600 },
        body1: { fontSize: '1rem', lineHeight: 1.7 },
        button: { fontWeight: 600, letterSpacing: '.01em' },
    },
    shape: { borderRadius: 12 },
    ...baseNoShadow,
    components: {
        ...baseNoShadow.components,
        MuiButton: {
            ...baseNoShadow.components.MuiButton,
            styleOverrides: {
                ...baseNoShadow.components.MuiButton!.styleOverrides!,
                contained: {
                    backgroundColor: '#1f1f1f',
                    color: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    '&:hover': { backgroundColor: '#2a2a2a', borderColor: 'rgba(0,0,0,0.16)' },
                },
                outlined: {
                    borderColor: 'rgba(0,0,0,0.16)',
                    color: '#1f1f1f',
                    '&:hover': { borderColor: 'rgba(0,0,0,0.28)', backgroundColor: '#f2f2f2' },
                },
            },
        },
    },
});

/* E-Ink: paper-like, low hue, highly legible */
const einkTheme = createTheme({
    palette: {
        mode: 'light',
        background: { default: '#f8f7f4', paper: '#f2f1ed' },
        primary: { main: '#1a1a1a', light: '#3a3a3a', dark: '#0d0d0d' },
        secondary: { main: '#8a8a8a', light: '#b0b0b0', dark: '#6a6a6a' },
        text: { primary: '#1a1a1a', secondary: '#555555' },
        divider: 'rgba(0,0,0,0.08)',
    },
    typography: {
        fontFamily:
            '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        h1: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.015em' },
        h2: { fontSize: '2.75rem', fontWeight: 700 },
        h3: { fontSize: '2rem', fontWeight: 600 },
        body1: { fontSize: '1.0625rem', lineHeight: 1.75 },
        button: { fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    ...baseNoShadow,
    components: {
        ...baseNoShadow.components,
        MuiButton: {
            ...baseNoShadow.components.MuiButton,
            styleOverrides: {
                ...baseNoShadow.components.MuiButton!.styleOverrides!,
                contained: {
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    '&:hover': { backgroundColor: '#232323', borderColor: 'rgba(0,0,0,0.16)' },
                },
                outlined: {
                    borderColor: 'rgba(0,0,0,0.16)',
                    color: '#1a1a1a',
                    '&:hover': { borderColor: 'rgba(0,0,0,0.28)', backgroundColor: '#ebeae6' },
                },
            },
        },
    },
});

export const themes: Record<ThemeName, Theme> = {
    luxury: luxuryTheme,
    monochrome: monochromeTheme,
    noir: noirTheme,
    graphite: graphiteTheme,
    platinum: platinumTheme,
    eink: einkTheme,
};

export function getTheme(themeName: ThemeName): Theme {
    return themes[themeName] || themes.luxury;
}
