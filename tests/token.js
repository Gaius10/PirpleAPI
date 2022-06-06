import { fetch } from './index.js';

export async function init() {
  
}

export default {
  async createToken() {
    const { data } = await fetch('https://localhost:8081/token', {
      method: 'POST',
      body: {

      }
    });
    console.log({ data });
  }
}
