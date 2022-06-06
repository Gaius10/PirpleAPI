import { RuimDatabase } from '../../../lib/RuimDatabase/RuimDatabase.js';
import { randomBytes } from 'crypto' // For generating random IDs

export default class UserRepository
{
  constructor() {
    this.db = new RuimDatabase(process.env.STORAGE_PATH + '/users');
  }
  getUserById(id) {
    return this.db.get(id);
  }
  async getUserByEmail(email) {
    if (typeof email !== 'string') {
      throw new Error('Email must be a string');
    }

    const users = await this.db.getAll('');
    return users.find(user => user.email === email);
  }
  getUsers(filters) { // @todo use filters
    return this.db.getAll('');
  }
  async createUser(user) {
    let id = '';

    do id = randomBytes(16).toString('hex');
    while (this.db.exists(id));

    await this.db.save({ id, ...user }, id);
    return { id, ...user };
  }
  updateUser(id, user) {
    user.id = id;
    return this.db.save(user, id);
  }
  deleteUser(id) {
    return this.db.delete(id);
  }
}
