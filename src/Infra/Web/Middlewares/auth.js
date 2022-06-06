import TokenRepository from "../../../Adapters/RuimDatabase/TokenRepository.js";
import UserRepository from "../../../Adapters/RuimDatabase/UserRepository.js";
import TokenInteractor from "../../../Interactors/TokenInteractor.js";

const tokenInteractor = new TokenInteractor(
  new UserRepository(),
  new TokenRepository()
);

export default async ({ payload, request, session }, next) => {
  const token = request.headers.authorization;

  if (!token) {
    throw {
      statusCode: 401,
      message: 'No token provided',
    };
  }

  const user = await tokenInteractor.getUserInfo( token.split(' ')[1] );
  session.set('user', user);

  return next({ payload, request, session });
}