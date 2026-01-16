// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    // "../Nep2n": "/"
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    openUrl: "Nep2n/index.html"
  },
  buildOptions: {
    out: "../nep2n-build",
    clean: true
  },
};
