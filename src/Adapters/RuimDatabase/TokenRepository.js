import { RuimDatabase } from '../../../lib/RuimDatabase/RuimDatabase.js';

export default class TokenRepository
{
  constructor() {
    this.db = new RuimDatabase(process.env.STORAGE_PATH + '/tokens');
  }

  get(token) {
    return this.db.get(token);
  }

  create({ token, user, expiration }) {
    this.db.save({ token, user, expiration }, token);
  }

  delete(token) {
    this.db.delete(token);
  }
}
