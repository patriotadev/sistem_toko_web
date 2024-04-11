import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/

export default({mode}) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    server: {
      strictPort: true,
      host: true,
      port: Number(process.env.VITE_APP_PORT),
      origin: `http://0.0.0.0:${process.env.VITE_APP_PORT}`
    },
    build: {
      commonjsOptions: {
        include: ["tailwind.config.js", "node_modules/**"],
      },
      target: "ESNext"
    },
    optimizeDeps: {
      include: ["tailwind-config"],
    },
    plugins: [react()],
    resolve: {
      alias: {
        "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
      },
    },
  })
}
