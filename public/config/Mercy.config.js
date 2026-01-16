// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
    mount: {
      // "../Mercy": "/"
    },
    plugins: [
      /* ... */
    ],
    packageOptions: {
      /* ... */
    },
    devOptions: {
      openUrl: "Mercy/index.html"
    },
    buildOptions: {
      out: "../mercy-build",
      clean: true
    },
  };
  