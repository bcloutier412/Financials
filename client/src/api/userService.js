import axios from 'axios'

const getUserProfile = async () => {
  try {
    return await axios.get('/api/user/profile')
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

const getUserWatchlist = async () => {
  try {
    return await axios.get('/api/user/watchList')
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

const postToUserWatchList = async (ticker) => {
  try {
    return await axios.post(`/api/user/addWatchList/${ticker}`);
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

const deleteFromUserWatchList = async (ticker) => {
  try {
    return await axios.delete(`/api/user/deleteWatchListTicker/${ticker}`);
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

export default {
  getUserProfile,
  getUserWatchlist,
  postToUserWatchList,
  deleteFromUserWatchList
}