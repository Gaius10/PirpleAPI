import UserInteractor from '../../../Interactors/UserInteractor.js';
import UserRepository from '../../../Adapters/RuimDatabase/UserRepository.js';

/** @todo move this instantiation out of here */
const interactor = new UserInteractor(new UserRepository());

export default {
  async create({ payload, request }) {
    const { name, phone, email, password } = payload;

    const createdUser = await interactor.create({ name, phone, email, password });

    return {
      statusCode: 201,
      body: {
        createdUser,
      }
    }
  },
  async read({ payload, request }) {
    return {
      statusCode: 200,
      body: {
        user: await interactor.getById(payload.id),
      }
    }
  },
  /** @todo read filters from payload */
  async list({ payload, request }) {
    return {
      statusCode: 200,
      body: {
        users: await interactor.get({}),
      }
    }
  },
  async update({ payload, request }) {
    const { id, name, phone, email, password } = payload;

    const updatedUser = await interactor.update(id, { name, phone, email, password });

    return {
      statusCode: 200,
      body: { updatedUser }
    }
  },
  async delete({ payload, request }) {
    const { id } = payload;
    await interactor.delete(id);
    return {
      statusCode: 200,
      body: {
        message: 'User has been deleted'
      }
    }
  }
}