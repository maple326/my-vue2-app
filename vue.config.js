const path = require("path");
const { defineConfig } = require("@vue/cli-service");
console.log(__dirname);
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = defineConfig({
  publicPath: "",
  transpileDependencies: true,
  devServer: {
    host: "localhost",
    port: 8080,
    // open: true,
    proxy: {
      "/": {
        target: "https://test.com", //uat环境
        changeOrigin: true, //是否跨域
        ws: false,
      },
    },
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        prependData: `@import "~@/styles/common.scss";`,
      },
      sass: {
        prependData: `@import "~@/styles/common.scss"`,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        components: resolve("src/components"),
        router: resolve("src/router"),
        store: resolve("src/store"),
        utils: resolve("src/utils"),
        api: resolve("src/api"),
      },
    },
  },
});
