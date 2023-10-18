const authRouter = require('express').Router()
const passport = require('passport');
const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const { checkAuthenticated, checkNotAuthenticated } = require("../utils/auth")

authRouter.post('/login', function (request, response, next) {
  console.log('login')
  try {
    // Authenticate the username and password
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return next({ statusCode: 404, message: info.message })
      }

      // Log the user in,create user session and send a authorization token to the client
      request.login({ id: user.id, username: user.username }, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        return response.status(200).send({ success: true, status: 200, message: "User successfully logged in", user: { name: user.name, username: user.username} });
      });
    })(request, response, next);
  } catch (error) {
    return next(error)
  }
});

authRouter.post('/register', async function (request, response, next) {
  console.log('register')
  try {
    // Check user input to make sure they didnt input an empty username, password, name
    if (!(request.body.username.trim() && request.body.password.trim() && request.body.name.trim())) {
      return next({ statusCode: 422, message: "Username, Password, or Name do not follow criteria" }) 
    }

    // Check to see if the user already exists, if they do then send an error message
    const userExist = await User.findOne({ username: request.body.username })
    if (userExist) { return next({ statusCode: 409, message: "Username is already taken" }) }

    // Create new user
    const newUser = new User({
      username: request.body.username,
      name: request.body.name,
      passwordHash: await bcrypt.hash(request.body.password, 10),
    })

    const user = await newUser.save()

    // Log the user in, create a session and send an authorization token to the client
    request.login({ id: user.id }, function (error) {
      if (error) { return next(error); }
      return response.status(201).send({ success: true, status: 201, message: "User successfully created", user: { name: user.name, username: user.username} });
    })
  } catch (error) {
    return next(error)
  }
});


authRouter.post('/logout', function (request, response, next) {
  // Remove the session token and log the user out
  request.logout(function (err) {
    if (err) { return next(err); }
  });
});

module.exports = authRouter;