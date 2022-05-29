
import config from './config.js';
import fs from 'fs';
import http from 'http';
import https from 'https';
import Router from './router.js';

/**
 * Middlewares...
 */
import errorHandler from './src/Infra/Web/Middlewares/error-handler.js';


/**
 * Handlers...
 */
import user from './src/Infra/Web/Handlers/user.js';


/**
 * Define the routes.
 */
const router = new Router();

router.get('/', () => { return { statusCode: 200, body: { message: 'Working!' } } });

router.get('/user',      user.read);
router.get('/user/list', user.list);
router.post('/user',     user.create);
router.put('/user',      user.update);
router.delete('/user',   user.delete);

router.addMiddleware(errorHandler);

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
