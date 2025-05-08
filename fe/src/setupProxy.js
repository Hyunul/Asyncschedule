const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://www.localhost:8080",
      // target: "http://www.hyunul.site:8080",
      changeOrigin: true,
    })
  );
};
