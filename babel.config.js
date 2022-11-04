module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
  ],
  env: {
    development: {
      plugins: ["babel-plugin-dynamic-import-node"],
    },
  },
};
