import UserInteractor from '../../../Interactors/UserInteractor.js';
import UserRepository from '../../../Adapters/RuimDatabase/UserRepository.js';

/** @todo move this instantiation out of here */

export default {
  async create({ payload, request }) {
    console.log('token.create');

    return {
      statusCode: 201,
      body: { message: 'token.create' }
    }
  },
  async revoke({ payload, request }) {
    console.log('token.revoke');

    return {
      statusCode: 200,
      body: { message: 'token.revoke' }
    }
  }
}