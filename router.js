import { URLSearchParams } from 'url';

function getPayloadFromRequest(request) {
  return new Promise((res, rej) => {
    request.on('error', rej);

    if (request.method === 'GET') {
      let payload = {};
      const searchParams = new URLSearchParams(request.url.split('?')[1]);
      searchParams.forEach((value, key) => payload[key] = value);
      res(payload);
    } else {
      let payload = '';
      request.on('data', chunk => payload += chunk.toString('utf8'));
      request.on('end', () => res(JSON.parse(payload)));
    }
  });
}

class Onion
{
  constructor(coreFunction) {
    this.onion = coreFunction;
  }

  wrap(layer) {
    const oldOnion = this.onion;
    this.onion = request => layer(request, oldOnion);
  }

  dispatch(request) {
    return this.onion(request);
  }
}

export default class Router {
  constructor() {
    this.routes = {};
    this.middlewares = [];
  }

  addRoute(method, path, handler, middlewares = []) {
    this.routes[path] = this.routes[path] || {};
    this.routes[path][method] = { handler, middlewares }
  }

  get(path, handler, middlewares = []) {
    this.addRoute('GET', path, handler, middlewares);
  }

  post(path, handler, middlewares = []) {
    this.addRoute('POST', path, handler, middlewares);
  }

  put(path, handler, middlewares = []) {
    this.addRoute('PUT', path, handler, middlewares);
  }

  delete(path, handler, middlewares = []) {
    this.addRoute('DELETE', path, handler, middlewares);
  }

  addMiddleware(middleware) {
    this.middlewares.push(middleware);
  }

  async route(request, response) {
    const { url, method } = request;

    this.routePack = this.routes[url.split('?')[0]];
    if (!this.routePack) {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Not found');
      return;
    }

    const route = this.routePack[method];
    if (!route) {
      response.writeHead(405, { 'Content-Type': 'text/plain' });
      response.end('Method not allowed');
      return;
    }

    const handler = route.handler;
    const middlewares = route.middlewares;

    if (!handler) {
      console.log('No handler');
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end('Internal server error');
      return;
    }

    const onion = new Onion(handler);

    middlewares.forEach(middleware => {
      onion.wrap(middleware);
    });

    this.middlewares.forEach(middleware => {
      onion.wrap(middleware);
    });

    const payload = await getPayloadFromRequest(request);

    const res = (await onion.dispatch({ payload, request })) || {};
    const { statusCode = 200, body = {}, headers = {} } = res;
    headers['Content-Type'] = 'application/json';

    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(body));
  }
}
