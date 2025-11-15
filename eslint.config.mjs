import pluginNext from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  { ignores: ["node_modules", ".next", "out", "build", "next-env.d.ts"] },
  {
    files: ["src/**/*"],
    plugins: { '@next/next': pluginNext },
    rules: { ...pluginNext.configs.recommended.rules }
  },
]

export default config;