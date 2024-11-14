import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()]
});
