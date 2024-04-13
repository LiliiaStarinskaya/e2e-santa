const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://santa-secret.ru",
    testIsolation: false,
    chromeWebSecurity: false,
    timeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
