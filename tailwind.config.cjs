module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: '#252B2E',
        muted: '#746F6A',
        canvas: '#F5F3EF',
        line: '#E5DFD7',
        brand: '#A9431E',
        success: '#2F6B45',
        warning: '#92400E',
        danger: '#B91C1C',
      },
    },
  },
  plugins: [],
};
