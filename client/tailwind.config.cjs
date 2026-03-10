/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic surface tokens — driven by CSS variables in index.css
        theme: {
          bg:     'var(--color-bg)',
          surface:'var(--color-surface)',
          card:   'var(--color-card)',
          sidebar:'var(--color-sidebar)',
          border: 'var(--color-border)',
          'border-soft': 'var(--color-border-soft)',
          text:   'var(--color-text)',
          'text-2':'var(--color-text-2)',
          'text-3':'var(--color-text-3)',
        },
        // Brand color — also driven by variable (indigo-500 light / indigo-400 dark)
        brand: {
          DEFAULT: 'var(--color-primary)',
          hover:   'var(--color-primary-hover)',
          soft:    'var(--color-primary-soft)',
          soft2:   'var(--color-primary-soft2)',
        },
        // Keep named palette colors for status badges etc.
        // (amber, emerald, red, blue are already in Tailwind defaults)
      }
    },
  },
  plugins: [],
}