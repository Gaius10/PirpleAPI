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
    this.onion = {};
  }

  route() {
    console.log('Router.route()');

    const onion = new Onion(() => {
      console.log('Core function');
    })

    onion.wrap((req, next) => {
      const res = next(req);
      console.log('First middleware');

      return res;
    })

    onion.wrap((req, next) => {
      const res = next(req);
      console.log('Second middleware');

      return res;
    })

    onion.dispatch(this.req);

    this.res.end();
  }
}
