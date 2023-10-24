const assetsRouter = require('express').Router()
const passport = require('passport');
const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const { checkAuthenticated, checkNotAuthenticated } = require("../utils/auth")

assetsRouter.get("/", checkAuthenticated, (request, response) => {
  const assets = request.user.assets;
  // const user = User.findOne({})
})

module.exports = assetsRouter