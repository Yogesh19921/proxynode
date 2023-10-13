const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

// Replace with your target host and port
const targetHost = '24.84.245.211';
const targetPort = 8080;

app.use((req, res) => {
    proxy.web(req, res, {
        target: `${targetHost}:${targetPort}`
    });
});

proxy.on('error', (err, req, res) => {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
});

app.listen(localport, () => {
    console.log(`Server running on port 8000, proxying requests to ${targetHost}:${targetPort}`);
});
