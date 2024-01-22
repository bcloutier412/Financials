import axios from 'axios'

const getQuoteChartAndSearch = async (ticker) => {
  try {
    return await axios.get(`/api/quote/chart-and-search/${ticker}`)
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currently down"
  }
}

const getChartData = async (ticker) => {
  try {
    return await axios.get(`/api/quote/chartData/${ticker}`)
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currenyl down"
  }
}

const getStockInfo = async (ticker) => {
  try {
    return await axios.get(`/api/quote/stockInfo/${ticker}`)
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currenyl down"
  }
}

const getOptionsData = async (ticker) => {
  try {
    return await axios.get(`/api/quote/optionsData/${ticker}`)
  } catch (error) {
    if (error.response) throw error.response.data.message;
    throw "API is currenyl down"
  }
}

export default {
  getQuoteChartAndSearch,
  getChartData,
  getStockInfo,
  getOptionsData
}