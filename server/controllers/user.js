const userRouter = require('express').Router()
const { User } = require('../models/user')
const { checkAuthenticated, checkNotAuthenticated } = require("../utils/auth")

userRouter.get('/profile', checkAuthenticated, async (request, response, next) => {
  console.log(request.isAuthenticated())
    // console.log(request.isAuthenticated())
    // console.log('authenticate worked')
    return response.send(request.user)
})

module.exports = userRouter