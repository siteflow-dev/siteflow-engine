import type { Config } from 'tailwindcss'

/**
 * SiteFlow — Tailwind Config
 *
 * Extende os breakpoints padrao com 'xs' (480px) para mobile grande.
 * As cores usam CSS Custom Properties do design system —
 * assim mudam automaticamente com a variante do cliente.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/engine/src/**/*.{ts,tsx}',
    '../../clients/*/components/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      // ── BREAKPOINTS ─────────────────────────────────────────────────
      // 'xs' adicionado — mobile grande (480px+)
      // Demais mantidos conforme padrao Tailwind
      screens: {
        xs: '480px',
        // sm: '640px'  — default
        // md: '768px'  — default
        // lg: '1024px' — default
        // xl: '1280px' — default
        // 2xl: '1536px' — default
      },

      // ── CORES VIA CSS CUSTOM PROPERTIES ─────────────────────────────
      // Nao hardcode valores — tudo via variantes do design system
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light:   'var(--primary-light)',
          dark:    'var(--primary-dark)',
          xlight:  'var(--primary-xlight)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light:   'var(--accent-light)',
        },
        rose: {
          DEFAULT: 'var(--rose)',
          light:   'var(--rose-light)',
        },
        bg: {
          base:   'var(--bg-base)',
          soft:   'var(--bg-soft)',
          mid:    'var(--bg-mid)',
          dark:   'var(--bg-dark)',
          darker: 'var(--bg-darker)',
        },
        text: {
          base:       'var(--text-base)',
          soft:       'var(--text-soft)',
          muted:      'var(--text-muted)',
          'on-dark':  'var(--text-on-dark)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
          dark:    'var(--border-dark)',
          focus:   'var(--border-focus)',
        },
        status: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          error:   'var(--error)',
          info:    'var(--info)',
        },
      },

      // ── TIPOGRAFIA ───────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
      },

      // ── BORDER RADIUS ────────────────────────────────────────────────
      borderRadius: {
        sm:   'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        lg:   'var(--radius-lg)',
        full: 'var(--radius-full)',
      },

      // ── BOX SHADOW ───────────────────────────────────────────────────
      boxShadow: {
        card:   'var(--shadow-card)',
        soft:   'var(--shadow-soft)',
        hover:  'var(--shadow-hover)',
        button: 'var(--shadow-button)',
        glow:   'var(--shadow-glow)',
      },

      // ── TRANSICOES ───────────────────────────────────────────────────
      transitionTimingFunction: {
        'sf-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ── ALTURA MINIMA — touch targets ────────────────────────────────
      minHeight: {
        touch:   'var(--touch-target)',  // 44px
        input:   'var(--input-height)',  // 48px
        'btn-sm':'var(--btn-height-sm)', // 40px
        btn:     'var(--btn-height)',    // 48px
        'btn-lg':'var(--btn-height-lg)', // 56px
      },

      // ── ALTURA DA NAV ────────────────────────────────────────────────
      height: {
        nav: 'var(--nav-height)',
      },

      // ── MAX WIDTH ────────────────────────────────────────────────────
      maxWidth: {
        content: 'var(--content-max)',
        narrow:  'var(--content-narrow)',
        wide:    'var(--content-wide)',
      },

      // ── PADDING LATERAL ──────────────────────────────────────────────
      padding: {
        page: 'var(--page-padding-x)',
      },

      // ── ESPACAMENTOS CUSTOMIZADOS ────────────────────────────────────
      spacing: {
        'section':    'var(--section-py)',
        'section-sm': 'var(--section-py-sm)',
      },
    },
  },

  plugins: [],
}

export default config
