import {nextui} from "@nextui-org/react"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // colors: {
      //   background: "var(--background)",
      //   foreground: "var(--foreground)",
      // },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
  purge: {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html',

      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    options: {
      // Add dynamically generated class to ensure present in TW build
      safelist: [
        'bg-lime-300',
        'bg-lime-600',
        'bg-cyan-400',
        'bg-blue-500',
        'bg-yellow-300',
        'bg-amber-600',
        'bg-red-500',
        'bg-red-300',
        'bg-violet-900',
        'bg-purple-500',
        'bg-stone-900',
        'bg-violet-900',
        'text-black',
        'text-white',
      ],
    },
  },
}
