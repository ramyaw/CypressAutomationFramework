const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'qey9hh',

  // override properties
  defaultCommandTimeout : 5000,
  env : {
    url : 'https://rahulshettyacademy.com'
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // specPattern: 'cypress/integration/**/*.js'
    specPattern: 'cypress/integration/framework/*.js'
  },
});
