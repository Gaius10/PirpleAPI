
async function handler(request) {
  return {
    statusCode: 200,
    body: { message: 'Working!' },
  }
}

export default {
  handler,
  middlewares: [],
}
