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
    this.onion(request);
  }
}

export default class Router {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.routes = {};
    this.middlewares = [];
  }

  addRoute(method, path, handler, middlewares = []) {
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

  route() {
    const { url, method } = this.req;

    this.routePack = this.routes[url];
    if (!this.routePack) {
      this.res.writeHead(404, { 'Content-Type': 'text/plain' });
      this.res.end('Not found');
      return;
    }

    const route = this.routePack[method];
    if (!route) {
      this.res.writeHead(405, { 'Content-Type': 'text/plain' });
      this.res.end('Method not allowed');
      return;
    }

    const handler = route.handler;
    const middlewares = route.middlewares;

    if (!handler) {
      console.log('No handler');
      this.res.writeHead(500, { 'Content-Type': 'text/plain' });
      this.res.end('Internal server error');
      return;
    }

    const onion = new Onion(handler);
    middlewares.forEach(middleware => {
      onion.addMiddleware(middleware);
    });

    this.middlewares.forEach(middleware => {
      onion.addMiddleware(middleware);
    });

    const response = onion.dispatch(this.req) || {};
    const { statusCode = 200, body = {}, headers = {} } = response;
    headers['Content-Type'] = 'application/json';

    this.res.writeHead(statusCode, headers);
    this.res.end(JSON.stringify(body));
  }
}
