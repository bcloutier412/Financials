const userRouter = require('express').Router()
const axios = require('axios')
const { User } = require('../models/user')
const { checkAuthenticated, checkNotAuthenticated } = require("../utils/auth")
const { YHF_API } = require('../utils/config')

userRouter.get('/profile', checkAuthenticated, async (request, response, next) => {
  console.log(request.isAuthenticated())
  // console.log(request.isAuthenticated())
  // console.log('authenticate worked')
  return response.send(request.user)
})

userRouter.get('/watchList', checkAuthenticated, async (request, response, next) => {
  return response.send(request.user.watchList)
})

userRouter.post('/addWatchList/:ticker', checkAuthenticated, async (request, response, next) => {
  const watchList = request.user.watchList;
  const ticker = request.params.ticker.toUpperCase()

  try {
    // Check to see they sent a ticker
    if (!ticker) {
      return next({ statusCode: 400, message: `Please input a ticker` })
    }
    // Check if the ticker is already in the watchlist
    if (watchList.includes(ticker)) {
      return next({ statusCode: 409, message: `${ticker} is already on the watch list` })
    }

    // Check to see if the ticker is valid in the yahoo finance api
    try {
      await axios.get(`${YHF_API}${ticker}`)
    } catch (error) {
      return next({ statusCode: 422, message: `${ticker} is not a valid ticker` })
    }
    
    // Add the ticker to the watchList and response with a 200 request and the ticker
    watchList.push(ticker);
    await request.user.save();
    return response.status(201).send({ success: true, status: 201, message: `${ticker} successfully added`, ticker })

  } catch (error) {
      next(error)
  }
})
module.exports = userRouter