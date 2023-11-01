import axios from 'axios'
import generateURL from './apiUtils'

const loginUser = async (loginInfo) => {
  const headers = {
    "Content-Type": "application/json",
  }
  try {
    return await axios.post(generateURL('/api/auth/login'), loginInfo, { headers })
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

const registerUser = async (loginInfo) => {
  const headers = {
    "Content-Type": "application/json",
  }
  try {
    return await axios.post(generateURL('/api/auth/register'), loginInfo, { headers })
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

export default {
  loginUser,
  registerUser
}