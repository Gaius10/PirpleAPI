import UserInteractor from '../../../Interactors/UserInteractor.js';
import UserRepository from '../../../Adapters/RuimDatabase/UserRepository.js';

/** @todo move this instantiation out of here */
const interactor = new UserInteractor(new UserRepository());

export default {
  async create({ payload, request }) {
    // name, phone, email, password
    const { name, phone, email, password } = payload;

    const createdUser = await interactor.create({ name, phone, email, password });

    return {
      statusCode: 201,
      body: {
        createdUser,
      }
    }
  },
  read({ payload, request }) {
    return {
      statusCode: 200,
      body: {
        message: 'working read'
      }
    }
  },
  list({ payload, request }) {
    return {
      statusCode: 200,
      body: {
        message: 'working list'
      }
    }
  },
  update({ payload, request }) {
    return {
      statusCode: 200,
      body: {
        message: 'working update'
      }
    }
  },
  delete({ payload, request }) {
    return {
      statusCode: 200,
      body: {
        message: 'working delete'
      }
    }
  }
}