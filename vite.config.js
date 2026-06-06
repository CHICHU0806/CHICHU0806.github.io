import { defineConfig } from 'vite'

export default defineConfig({
    base: '/CHICHU.github.io/',
    build: {
        outDir: 'docs',
        emptyOutDir: true
    }
})