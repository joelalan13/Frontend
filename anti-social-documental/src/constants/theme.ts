// Colores principales de la aplicación
export const COLORS = {
  // Neutrales
  BG_PRIMARY: '#0c110d',
  BG_SECONDARY: '#111812',
  BG_DARK: '#080C09',
  BG_LIGHT: '#151a16',

  // Texto
  TEXT_PRIMARY: '#EDFAEE',
  TEXT_SECONDARY: '#7d8d81',
  TEXT_MUTED: '#888',

  // Bordes
  BORDER_PRIMARY: '#243224',
  BORDER_SECONDARY: '#2a3e2d',

  // Acentos
  GREEN_PRIMARY: '#00D166',
  GREEN_HOVER: '#00c75a',
  CYAN_PRIMARY: '#49C6D9',
  CYAN_HOVER: '#6ed8e8',
  RED_PRIMARY: '#ff6b6b',
  RED_HOVER: '#ff5252',

  // Estados
  ERROR: '#ff6b6b',
  SUCCESS: '#00D166',
  WARNING: '#ffb700',
  INFO: '#49C6D9',
} as const

// Dimensiones
export const DIMENSIONS = {
  AVATAR_SIZE: 48,
  AVATAR_PROFILE_SIZE: 150,
  BORDER_RADIUS_SM: '4px',
  BORDER_RADIUS_MD: '6px',
  BORDER_RADIUS_LG: '8px',
  BORDER_RADIUS_FULL: '50%',
} as const

// Transiciones y animaciones
export const ANIMATIONS = {
  TRANSITION_FAST: '0.15s ease',
  TRANSITION_NORMAL: '0.2s ease',
  TRANSITION_SLOW: '0.3s ease',
} as const

// Z-index
export const Z_INDEX = {
  DROPDOWN: 10,
  MODAL: 100,
  TOAST: 1000,
  TOOLTIP: 1100,
} as const
