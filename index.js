
import config from './config.js';
import fs from 'fs';
import http from 'http';
import https from 'https';
import app from './src/app.js';

http.createServer((req, res) => {
  res.writeHead(301, {
    'Location': config.appUrl + ":" + config.httpsPort + req.url
  });

  res.end();
}).listen(config.httpPort);

https.createServer({
  key: fs.readFileSync(config.httpsKeyPath),
  cert: fs.readFileSync(config.httpsCertPath)
}, (req, res) => {
  res.writeHead({ 'Content-Type': 'application/json' });
  app.handle(req).then(res.end);
}).listen(config.httpsPort);
