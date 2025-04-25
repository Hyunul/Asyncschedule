const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://www.enfycius.com:8005",
      changeOrigin: true,
    })
  );
};
