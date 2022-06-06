class Session {
  constructor() {
    this.info = {};
  }
  set(key, value) {
    this.info[key] = value;
  }

  get(key) {
    return this.info[key];
  }
}

export default async ({ payload, request }, next) => {
  return next({ payload, request, session: new Session() });
}
