
import config from './config.js';
import fs from 'fs';
import http from 'http';
import https from 'https';
import Router from './src/router.js';

/**
 * @description Just to force https
 */
http.createServer((req, res) => {
  res.writeHead(301, {
    'Location': config.appUrl + ":" + config.httpsPort + req.url
  });

  res.end();
}).listen(config.httpPort);

/**
 * @description General starting point of the application
 */
https.createServer({
  key: fs.readFileSync(config.httpsKeyPath),
  cert: fs.readFileSync(config.httpsCertPath)
}, (req, res) => {
  const router = new Router(req, res);
  router.route();
}).listen(config.httpsPort);
