import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    base: '/random-bingo-number/',
    plugins: [vue()]
})