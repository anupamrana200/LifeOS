import { breakpoints, radius, shadows, spacing, transitions, zIndex } from './src/theme/index.js';

const cssColor = (token) => `rgb(var(--color-${token}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    screens: breakpoints,
    extend: {
      colors: {
        primary: cssColor('primary'),
        secondary: cssColor('secondary'),
        accent: cssColor('accent'),
        success: cssColor('success'),
        warning: cssColor('warning'),
        danger: cssColor('danger'),
        canvas: cssColor('canvas'),
        surface: cssColor('surface'),
        card: cssColor('card'),
        border: cssColor('border'),
        content: {
          primary: cssColor('content-primary'),
          secondary: cssColor('content-secondary'),
          muted: cssColor('content-muted'),
          inverse: cssColor('content-inverse'),
        },
        sidebar: {
          base: cssColor('sidebar-base'),
          border: cssColor('sidebar-border'),
          active: cssColor('sidebar-active'),
          text: cssColor('sidebar-text'),
        },
        navbar: {
          base: cssColor('navbar-base'),
          border: cssColor('navbar-border'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      spacing,
      borderRadius: radius,
      boxShadow: shadows,
      transitionDuration: transitions.duration,
      transitionTimingFunction: transitions.easing,
      zIndex,
    },
  },
  plugins: [],
};

