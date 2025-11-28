import { defineConfig } from "cypress";
import {BASE_URL} from "./globalServices/API";

export default defineConfig({
  projectId: '2cwwvq',
  e2e: {
    baseUrl: BASE_URL,
    viewportWidth: 1366,
    viewportHeight: 768,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
