
import config from './config.js';
import fs from 'fs';
import http from 'http';
import https from 'https';
import Router from './router.js';


/**
 * Handlers...
 */
import test from './src/Adapters/Web/Handlers/test.js';


/**
 * Define the routes.
 */
const router = new Router();

router.get('/', test.handler, test.middlewares);

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
  router.route(req, res);
}).listen(config.httpsPort);
