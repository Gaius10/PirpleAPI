import TokenInteractor from '../../../Interactors/TokenInteractor.js';
import UserRepository from '../../../Adapters/RuimDatabase/UserRepository.js';
import TokenRepository from '../../../Adapters/RuimDatabase/TokenRepository.js';

/** @todo move this instantiation out of here */
const tokenInteractor = new TokenInteractor(
  new UserRepository(),
  new TokenRepository()
);

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