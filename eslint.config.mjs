import js from '@eslint/js'
import globals from "globals";
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
//import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node },
    plugins: { js, stylistic },
    extends: ["js/recommended"]
  },
  globalIgnores(['./dist/'])

]);
