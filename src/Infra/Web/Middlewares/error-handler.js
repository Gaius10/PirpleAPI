export default async (request, next) => {
  try {
    return await next(request);
  } catch (e) {
    if (e.statusCode) {
      return {
        statusCode: e.statusCode,
        body: { message: e.message },
      };
    } else {
      console.log({ e });
      return {
        statusCode: 500,
        body: {
          message: 'Internal Server Error',
          error: e.message,
        }
      }
    }
  }
}