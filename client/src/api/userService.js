import axios from 'axios'

const getUserProfile = async () => {
  try {
    return await axios.get('/api/user/profile')
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

export default {
  getUserProfile
}