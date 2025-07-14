module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Custom spacing system
      spacing: {
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        // Component spacing
        'component-v': '16px',
        'component-h': '24px',
      },
      // Custom breakpoints
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
      },
      // Maximum content widths
      maxWidth: {
        'mobile': '100%',
        'tablet': '720px',
        'desktop': '1200px',
        'content': '1200px',
      },
      // Consistent border radius
      borderRadius: {
        'small': '4px',
        'medium': '8px',
        'large': '12px',
      },
      colors: {
        'primary-dark-blue': '#0a1a3a',
        'deep-dark-blue': '#020817',
        'accent-blue': '#1e40af',
        'glass-blue': 'rgba(30, 64, 175, 0.1)',
        'footer-dark-blue': '#0f172a',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0a1a3a 0%, #020817 100%)',
        'hero-gradient': 'linear-gradient(135deg, #1e40af 0%, #0a1a3a 50%, #020817 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
      keyframes: {
        'single-bounce-with-delay': {
          '0%': { transform: 'translateY(0)' },
          '4%': { transform: 'translateY(-15px)' },
          '8%': { transform: 'translateY(0)' },
          '12%': { transform: 'translateY(-10px)' },
          '16%': { transform: 'translateY(0)' },
          '20%': { transform: 'translateY(-5px)' },
          '24%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'single-bounce-with-delay': 'single-bounce-with-delay 5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};