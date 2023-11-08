import axios from 'axios'

const getQuoteChartAndSearch = async (ticker) => {
  try {
    return await axios.get(`/api/quote/chart-and-search/${ticker}`)
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

export default {
  getQuoteChartAndSearch
}