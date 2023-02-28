const {
  createProxyMiddleware
} = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(createProxyMiddleware(
      "/wallhaven", {
          target: "https://wallhaven.cc/",
          changeOrigin: true,
          pathRewrite: {
              "^/wallhaven": "" // 如果是/api开头的请求全部跳至target对应的地址
          }
      }
  ));
};
