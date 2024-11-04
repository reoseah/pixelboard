import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'
// import circleDependency from "vite-plugin-circular-dependency"

export default defineConfig({
  base: '/pixelboard/',
  plugins: [
    solid(),
    solidSvg(),
    // circleDependency()
  ],
})
