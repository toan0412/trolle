import axios from './base_axios'


const loginAPI = (user) => {
  return axios
    .post('/api/auth/login', user)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(`Login failed: `, error);
      throw error;
    });
}

export default loginAPI

