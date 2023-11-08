require('dotenv').config()

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const PORT = process.env.PORT
const SECRET = process.env.SECRET
const YHF_API_CHART = process.env.YHF_API_CHART
const YHF_API_QUERY = process.env.YHF_API_QUERY
module.exports = {
    MONGODB_URI,
    PORT,
    SECRET,
    YHF_API_CHART,
    YHF_API_QUERY
}