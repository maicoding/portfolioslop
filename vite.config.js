import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        classicIndex: resolve(__dirname, 'classic-index.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        postdigital: resolve(__dirname, 'postdigital.html'),
        version20: resolve(__dirname, 'version-2-0.html'),
        version25: resolve(__dirname, 'version-2-5.html'),
        version3: resolve(__dirname, 'version-3.html'),
        version5: resolve(__dirname, 'version-5.html'),
        threedvr: resolve(__dirname, 'threedvr.html'),
        gravityisoptional: resolve(__dirname, 'gravity-is-optional.html'),
        posteverything: resolve(__dirname, 'bachelorprojekt-post-everything.html'),
        blog: resolve(__dirname, 'blog.html'),
        lehrkonzept: resolve(__dirname, 'lehrkonzept.html'),
        lehrprojekte: resolve(__dirname, 'lehrprojekte.html'),
        linkarchiv: resolve(__dirname, 'linkarchiv.html'),
        copymachine: resolve(__dirname, 'copy-machine.html'),
        project: resolve(__dirname, 'project.html'),
        socialgenerator: resolve(__dirname, 'social-generator.html'),
        flexiblevisualsystems: resolve(__dirname, 'flexible-visual-systems.html'),
        gridblob: resolve(__dirname, 'grid-blob.html'),
        logogenerator: resolve(__dirname, 'logo-generator.html'),
        swarmgen: resolve(__dirname, 'swarm-gen.html'),
        xfontlab: resolve(__dirname, 'x-font-lab.html'),
        slopomatic: resolve(__dirname, 'slop-o-matic.html'),
      },
    },
  },
})
