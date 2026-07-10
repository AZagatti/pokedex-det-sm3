import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import svelte from "ultracite/oxlint/svelte";

export default defineConfig({
  extends: [core, svelte],
  ignorePatterns: core.ignorePatterns,
  rules: {
    "func-style": "off",
    // false positive: doesn't see reassignments of $state() bindings
    // that happen inside event handlers/effects elsewhere in .svelte files
    "prefer-const": "off",
    "unicorn/filename-case": "off",
  },
});
