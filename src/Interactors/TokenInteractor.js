import { randomBytes, verify } from 'crypto';

export default class TokenInteractor {
  constructor(userRepository, tokenRepository) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  /** @todo move password verification implementation out of here. */
  async create({ email, password }) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found',
      };
    }

    const key = pbkdf2Sync(password, process.env.APP_KEY, 100000, 64, 'sha512');
    if (key !== user.password) {
      throw {
        statusCode: 401,
        message: 'Invalid password',
      };
    }

    const token = randomBytes(16).toString('hex');
    this.tokenRepository.create({
      token,
      user: user.id,
      expiration: new Date(Date.now() + 1000 * 60 * 60), // 1h
    });

    return {
      token,
      expiresIn: '1h',
    };
  }

  async revoke({ token }) {
    const tokenRecord = await this.tokenRepository.getByToken(token);

    if (!tokenRecord) {
      throw {
        statusCode: 404,
        message: 'Token not found',
      };
    }

    this.tokenRepository.delete(tokenRecord.id);
  }

  async getUserInfo(token) {
    const tokenRecord = await this.tokenRepository.get(token);

    if (!tokenRecord) {
      throw {
        statusCode: 401,
        message: 'Invalid token',
      };
    }

    if (new Date(tokenRecord.expiration) < new Date()) {
      throw {
        statusCode: 401,
        message: 'Token expired',
      };
    }

    const user = await this.userRepository.getUserById(tokenRecord.user);

    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found',
      };
    }

    return user;
  }
}