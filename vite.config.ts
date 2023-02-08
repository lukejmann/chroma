// import { Alias } from "vite";

import react from "@vitejs/plugin-react-swc";
// import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from "vite";
import macrosPlugin from "vite-plugin-babel-macros";
// import { createHtmlPlugin } from "vite-plugin-html";
import svg from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
// import { relativeAliasResolver } from "./config/vite";
// const path = require("path");

// import { name, version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   port: 8000,
  // },
  plugins: [
    tsconfigPaths(),
    react(),
    svg({ svgrOptions: { icon: true } }),
    // createHtmlPlugin({
    //   minify: true,
    // }),
    macrosPlugin(),
    // visualizer({
    // 	gzipSize: true,
    // 	brotliSize: true
    // })
  ],
  root: ".",
  // define: {
  //   pkgJson: { name, version },
  // },
  build: {
    outDir: "../dist",
    assetsDir: ".",
  },
});
