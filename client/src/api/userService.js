import axios from 'axios'

const getUserInfo = async () => {
  try {
    return await axios.get('/api/user/profile')
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

const loginUser = async (loginInfo) => {
  const headers = {
    "Content-Type": "application/json",
  }
  try {
    return await axios.post('/api/auth/login', loginInfo, { headers })
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

export default {
  getUserInfo,
  loginUser
}