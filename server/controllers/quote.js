const quoteRouter = require('express').Router()
const axios = require('axios')
const { checkAuthenticated } = require("../utils/auth")
const { YHF_API_CHART, YHF_API_QUERY } = require('../utils/config')

quoteRouter.get("/", checkAuthenticated, (request, response, next) => {
  response.send("Success")
})

quoteRouter.get("/chart-and-search/:ticker", checkAuthenticated, async (request, response, next) => {
  const ticker = request.params.ticker;
  try {
    const YHResponse = await Promise.all([
      axios.get(`${YHF_API_CHART}${ticker}`),
      axios.get(`${YHF_API_QUERY}${ticker}`)
    ])

    const chart = YHResponse[0].data.chart.result[0];
    const quote = YHResponse[1].data;
    
    if (!chart || !quote) {
      return next({ statusCode: 502, message: "API Error" })
    }

    return response.status(200).send({ success: true, status: 200, message: "Data retreived successfully", data: { chart, quote } });
  } catch (error) {
    console.log(error)
    return next(error)
  }

})

module.exports = quoteRouter