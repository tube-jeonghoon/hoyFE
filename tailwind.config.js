/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        white: '#fff',
        'gray-1': '#F7F8FA',
        'gray-2': '#EAEEF3',
        'gray-3': '#DFE0E8',
        'gray-4': '#B1B5BB',
        'gray-5': '#9092A0',
        black: '#565656',
        'primary-blue': '#297FFF',
        'primary-red': '#F63C3C',
      },
      textColor: {
        white: '#fff',
        'gray-1': '#F7F8FA',
        'gray-2': '#EAEEF3',
        'gray-3': '#DFE0E8',
        'gray-4': '#B1B5BB',
        'gray-5': '#9092A0',
        black: '#565656',
        'primary-blue': '#297FFF',
        'primary-red': '#F63C3C',
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
    },
    plugins: [],
  },
};
