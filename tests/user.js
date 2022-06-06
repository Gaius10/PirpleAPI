
import fs from 'fs';
import { fetch } from './index.js';
import { strict as assert } from 'assert';

export async function init() {
  const token = {
    'token': 'testToken',
    'user': 'asjsfj123j1o2j1n23n123l12n3123',
    'expiration': '2023-01-01T00:00:00.000Z',
  }

  const expiredToken = {
    'token': 'expiredToken',
    'user': 'asjsfj123j1o2j1n23n123l12n3123',
    'expiration': '2000-01-01T00:00:00.000Z',
  }

  const user = {
    'id': 'asjsfj123j1o2j1n23n123l12n3123',
    'name': 'John Doe',
    'email': 'john.doe@email.com',
    'password': '12345678',
    'phone': '+5555555555',
  }

  fs.mkdirSync(process.env.STORAGE_PATH, { recursive: true });
  fs.mkdirSync(process.env.STORAGE_PATH + '/users');
  fs.mkdirSync(process.env.STORAGE_PATH + '/tokens');

  fs.writeFileSync(
    process.env.STORAGE_PATH + '/users/' + user.id + '.json',
    JSON.stringify(user, null, 2),
  );

  fs.writeFileSync(
    process.env.STORAGE_PATH + '/tokens/' + token.token + '.json',
    JSON.stringify(token, null, 2),
  );

  fs.writeFileSync(
    process.env.STORAGE_PATH + '/tokens/' + expiredToken.token + '.json',
    JSON.stringify(expiredToken, null, 2),
  );
}

export default {
  async createUser() {
    const { data, statusCode } = await fetch(
      'https://localhost:8081/user',
      {
        method: 'POST',
        body: {
          name: 'Created User',
          email: 'example@email.com',
          password: '12345678',
          phone: '+5555555555',
        }
      }
    );

    assert.equal(statusCode, 201);
    assert.equal(data.createdUser.name, 'Created User');
    assert.equal(data.createdUser.email, 'example@email.com');
    assert.equal(data.createdUser.phone, '+5555555555');
    assert.equal(typeof data.createdUser.id, 'string');
  },

  async noTokenError() {
    const { statusCode, data } = await fetch(
      'https://localhost:8081/user?id=asjsfj123j1o2j1n23n123l12n3123',
      { method: 'GET' }
    );

    assert.equal(statusCode, 401);
    assert.equal(data.message, 'No token provided');
  },

  async invalidTokenError() {
    const { statusCode, data } = await fetch(
      'https://localhost:8081/user?id=asjsfj123j1o2j1n23n123l12n3123',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer 1234567890',
        }
      }
    );

    assert.equal(statusCode, 401);
    assert.equal(data.message, 'Invalid token');
  },

  async expiredTokenError() {
    const { statusCode, data } = await fetch(
      'https://localhost:8081/user?id=asjsfj123j1o2j1n23n123l12n3123',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer expiredToken',
        }
      }
    );

    assert.equal(statusCode, 401);
    assert.equal(data.message, 'Token expired');
  },

  async getUser() {
    const { data, statusCode } = await fetch(
      'https://localhost:8081/user?id=asjsfj123j1o2j1n23n123l12n3123',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer testToken',
        }
      }
    );

    assert.equal(statusCode, 200);
    assert.equal(data.user.name, 'John Doe');
    assert.equal(data.user.email, 'john.doe@email.com');
    assert.equal(data.user.phone, '+5555555555');
    assert.equal(data.user.id, 'asjsfj123j1o2j1n23n123l12n3123');
  }
}
