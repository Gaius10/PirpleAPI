import { pbkdf2Sync } from 'crypto';

export default class UserInteractor {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /** @todo To improve this validation */
  validateUser({ name, phone, email, password }) {
    return name && phone && email && password &&
      typeof password == 'string' &&
      typeof name     == 'string' &&
      typeof phone    == 'string' &&
      typeof email    == 'string';
  }

  presentUser({ id, name, phone, email, password }) {
    return { id, name, phone, email };
  }

  async getById(id) {
    if (!id) {
      throw {
        statusCode: 400,
        message: 'Invalid user id'
      }
    }
    return await this.userRepository.getUserById(id);
  }

  async getByEmail(email) {
    return await this.userRepository.getUserByEmail(email);
  }

  async get(filters) {
    return (await this.userRepository.getUsers(filters)).map(this.presentUser);
  }

  async create(user) {
    if (!this.validateUser(user)) {
      throw {
        statusCode: 400,
        message: 'Invalid user data'
      };
    }

    // Check if user exists
    const userExists = await this.userRepository.getUserByEmail(user.email);
    if (userExists) {
      throw {
        statusCode: 400,
        message: `User with email '${user.email}' already exists`
      };
    }

    // Hash password
    const salt = process.env.APP_KEY;
    if (!salt) throw new Error('APP_KEY is not defined');

    user.password = pbkdf2Sync(user.password, salt, 100000, 64, 'sha512').toString('hex');

    // Create user
    return this.presentUser(
      await this.userRepository.createUser(user)
    );
  }

  async update(id, user) {
    if (!id) {
      throw {
        statusCode: 400,
        message: 'Invalid user id'
      }
    }
    if (!this.validateUser(user)) {
      throw {
        statusCode: 400,
        message: 'Invalid user data'
      };
    }

    // Check if user exists
    const userExists = await this.userRepository.getUserById(id);
    if (!userExists) {
      throw {
        statusCode: 400,
        message: `User with id '${id}' does not exist`
      };
    }


    // Hash password
    const salt = process.env.APP_KEY;
    if (!salt) throw new Error('APP_KEY is not defined');

    user.password = pbkdf2Sync(user.password, salt, 100000, 64, 'sha512').toString('hex');

    return await this.userRepository.updateUser(id, user);
  }

  async delete(id) {
    if (!id) {
      throw {
        statusCode: 400,
        message: 'Empty user id'
      };
    }

    // Check if user exists
    const userExists = await this.userRepository.getUserById(id);
    if (!userExists) {
      throw {
        statusCode: 400,
        message: `User with id '${id}' does not exist`
      };
    }

    return await this.userRepository.deleteUser(id);
  }
}