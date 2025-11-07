import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '2cwwvq',
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 1366,
    viewportHeight: 768,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
