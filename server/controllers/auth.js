const authRouter = require('express').Router()
const passport = require('passport');
const bcrypt = require('bcrypt')
const { User } = require('../models/user')
const { checkAuthenticated, checkNotAuthenticated } = require("../utils/auth")

authRouter.get('/testing', checkAuthenticated, function (request, response) {
  console.log(request.isAuthenticated())
  // console.log(request.isAuthenticated())
  // console.log('authenticate worked')
  response.send(request.user)
})
authRouter.get("/hello", async (request, response, next) => {
  response.status(200).send({ message: "hello" })
})

authRouter.post('/login', function (request, response, next) {
  console.log('login')
  try {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return next({ statusCode: 404, message: info.message })
      }

      request.login({ id: user.id, username: user.username }, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        return response.status(200).send({ success: true, status: 200, message: "User successfully logged in"});
      });
    })(request, response, next);
  } catch (error) {
    return next(error)
  }
});

authRouter.post('/register', async function (request, response, next) {
  console.log('register')
  // Check user input to make sure they didnt input an empty username, password, name
  // Check to see if the user already exists, if they do then send an error message
  try {
    const userExist = await User.findOne({ username: request.body.username })
    if (userExist) { return next({ statusCode: 409, message: "Username is already taken" }) }

    const newUser = new User({
      username: request.body.username,
      name: request.body.name,
      passwordHash: await bcrypt.hash(request.body.password, 10),
    })

    const user = await newUser.save()
    request.login({ id: user.id }, function (error) {
      if (error) { return next(error); }
      console.log('Redirect')
      return response.status(201).send({ success: true, status: 201, message: "User successfully created"});
    })
  } catch (error) {
    return next(error)
  }
});


authRouter.post('/logout', function (request, response, next) {
  request.logout(function (err) {
    if (err) { return next(err); }
  });
});

module.exports = authRouter;