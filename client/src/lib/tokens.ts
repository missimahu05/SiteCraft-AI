/**
 * Design System Semantic Tokens for SiteCraft.AI
 * Architecture en couches étanches conforme au standard Production Web Engineer
 */

export const DESIGN_TOKENS = {
  colors: {
    // FeexPay Inspired Brand Identity : Pure White, Deep Slate & Warm Orange
    primary: {
      default: '#EA580C', // FeexPay Signature Orange
      dark: '#C2410C',
      light: '#FB923C',
      surface: '#FFF7ED', // Soft Peach Tint
    },
    accent: {
      default: '#0F172A', // Deep Slate / Authority
      dark: '#020617',
      light: '#1E293B',
      glow: 'rgba(234, 88, 12, 0.25)',
      subtle: '#FFF7ED',
    },
    status: {
      pending: '#EA580C',
      pendingBg: '#FFF7ED',
      pendingBorder: '#FED7AA',
      success: '#10B981',
      successBg: '#ECFDF5',
      info: '#2563EB',
      infoBg: '#EFF6FF',
      balance: '#FEF08A',
    },
    // Sémantique UI — Pure White & Crisp Slate Architectural System
    surface: {
      canvas: '#F8FAFC',
      canvasAlt: '#FFFFFF',
      card: '#FFFFFF',
      cardElevated: '#FFFFFF',
      borderSubtle: '#E2E8F0',
      borderHover: '#CBD5E1',
      glass: 'rgba(255, 255, 255, 0.95)',
    },
    // Neutres & Typographie à fort contraste (WCAG AAA)
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#64748B',
      inverted: '#FFFFFF',
    },
  },
  typography: {
    fontDisplay: "'Outfit', -apple-system, sans-serif",
    fontBody: "'Inter', -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    scale: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    card: '0 8px 32px -4px rgba(0, 0, 0, 0.4)',
    cardHover: '0 20px 48px -8px rgba(0, 0, 0, 0.6)',
    glowCrimson: '0 0 25px rgba(196, 22, 65, 0.35)',
    glowCyan: '0 0 25px rgba(6, 182, 212, 0.3)',
    glowEmerald: '0 0 25px rgba(16, 185, 129, 0.3)',
  },
} as const;
