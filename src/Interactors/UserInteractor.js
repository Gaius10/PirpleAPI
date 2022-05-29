export default class UserInteractor
{
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /** @todo To improve this validation */
  validateUser({ name, phone, email, password }) {
    return name && phone && email && password;
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
    return await this.userRepository.getUsers(filters);
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

    // Create user
    return await this.userRepository.createUser(user);
  }

  async update(id, user) {
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

    return await this.userRepository.updateUser(id, user);
  }

  async delete(id) {
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