const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/*',
  createProxyMiddleware({
    target: 'http://24.84.245.211:8080',
    changeOrigin: true,
  }),
);

app.listen(process.env.PORT);