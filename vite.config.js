import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/terminal/*',  // Adjust the src path as needed
          dest: ''              // Destination in the public folder
        }
      ]
    })
  ]
});