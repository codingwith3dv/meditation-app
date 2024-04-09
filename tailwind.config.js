/** @type {import('tailwindcss').Config} */
export default {
	content: ['./node_modules/preline/preline.js', './src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#FCA311',
				bg: '#E5E5E5'
			}
		}
	},
	plugins: [require('preline/plugin')]
};
