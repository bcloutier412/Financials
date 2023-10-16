import axios from 'axios'

const getUserInfo = async () => {
  return await axios.get('/api/user/profile')
}

export default {
  getUserInfo
}