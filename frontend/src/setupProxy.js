const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://pgee-social-media.herokuapp.com',
      changeOrigin: true,
    })
  );
};