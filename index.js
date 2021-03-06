
import config from './config.js';
import fs from 'fs';
import http from 'http';
import https from 'https';
import Router from './router.js';

Object.keys(config.env).forEach(key => {
  process.env[key] = config.env[key];
});

/**
 * Middlewares...
 */
import errorHandler from './src/Infra/Web/Middlewares/error-handler.js';
import session      from './src/Infra/Web/Middlewares/session.js';
import auth         from './src/Infra/Web/Middlewares/auth.js';

/**
 * Handlers...
 */
import user  from './src/Infra/Web/Handlers/user.js';
import token from './src/Infra/Web/Handlers/token.js';


/**
 * Define the routes.
 */
const router = new Router();

router.get('/', () => { return { statusCode: 200, body: { message: 'Working!' } } });

// User
router.post('/user',     user.create); // OK
router.get('/user',      user.read,   [ auth ]);   // OK
router.get('/user/list', user.list,   [ auth ]);   // OK
router.put('/user',      user.update, [ auth ]); // OK
router.delete('/user',   user.delete, [ auth ]); // OK

// Token
// @todo Implement a refresh token system with JWT
// @todo Implement a oauth system
router.post('/token',   token.create); // @test
router.delete('/token', token.revoke, [ auth ]); // @test

router.addMiddleware(session);
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

console.log('Server running at https://localhost:' + config.httpsPort);
