import axios from '../../axiosConfig'
import generateURL from './apiUtils';

const getUserProfile = async () => {
  try {
    return await axios.get(generateURL('/api/user/profile'))
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

const getUserWatchlist = async () => {
  try {
    return await axios.get(generateURL('/api/user/watchList'))
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

const postToUserWatchList = async (ticker) => {
  try {
    return await axios.post(generateURL(`/api/user/addWatchList/${ticker}`));
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

export default {
  getUserProfile,
  getUserWatchlist,
  postToUserWatchList
}