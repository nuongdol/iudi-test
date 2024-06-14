/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT')
module.exports = withMT({
    plugins: [require('daisyui')],
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            screens: {
                'sm': { 'max': '399px' },
                'md': '400px',
            },
            backgroundImage: {
                'bg-card': "url('/src/images/background.jpg')",
            },
        },

        fontFamily: {
            inter: ['Inter', 'sans-serif'],
            roboto: ['Roboto', 'sans-serif'],
        },

        colors: {
            green: '#50C759',
            greenlight: '#4EC957 ',
        },
    },
})
