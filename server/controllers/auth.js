const authRouter = require('express').Router()
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const { User } = require('../models/user')

const checkAuthenticated = (request, response, next) => {
  console.log('checking authentication')
  try {
    if (request.isAuthenticated()) { return next() }
    else { return response.status(401).send({ message: "I got no clue"}) }
  } catch (error) {
    return next(error)
  }
}

const checkNotAuthenticated = (request, response, next) => {
  try {
    if (!request.isAuthenticated()) { return next() }
    return response.redirect("/")
  } catch (error) {
    return next(error)
  }
}

authRouter.get('/testing', checkAuthenticated, function (request, response) {
  console.log(request.isAuthenticated())
  // console.log(request.isAuthenticated())
  // console.log('authenticate worked')
  response.send(request.user)
})
authRouter.get("/hello", async (request, response, next) => {

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
        return response.status(200).send({ success: true, status: 201, message: "User successfully logged in"});
      });
    })(request, response, next);
  } catch (error) {
    return next(error)
  }
});

authRouter.post('/register', async function (request, response, next) {
  console.log('register')
  // Check to see if the user already exists, if they do then send an error message
  try {
    const userExist = await User.findOne({ username: request.body.username })
    if (userExist) { return next({ message: "Username is already taken" }) }

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


  // Use the request.login function
});


authRouter.post('/logout', function (request, response, next) {
  request.logout(function (err) {
    if (err) { return next(err); }
    response.redirect('/');
  });
});

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  console.log('local strategy')
  try {
    const user = await User.findOne({ username: username });

    if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }) };

    const isValidLogin = bcrypt.compare(password, user.passwordHash);
    if (!isValidLogin) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    return cb(null, user);
  } catch (error) {
    return cb(error)
  }

}));

passport.serializeUser(function (user, cb) {
  console.log('serializing')
  return cb(null, user.id)
});

passport.deserializeUser(async function (id, cb) {
  console.log('deserializing')
  const user = await User.findOne({ _id: id })
  if (!user) { return cb("User doesn't exist") }
  return cb(null, user)
});
module.exports = authRouter;