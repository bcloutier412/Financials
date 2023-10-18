const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { User } = require('../models/user')

const api = supertest(app)

const requestPostJSON = (route, data) => {
  return api.post(`/api/auth/${route}`).send(data).set('Accept', 'application/json');
}

/** 
 * @Register_Feature_Test
*/
describe('POST /api/auth/register', () => {
  test('Register a user and receive success status message', async () => {
    const response = await requestPostJSON('/register', { "username": "newUser", "password": "password", "name": "newUser" })
  
    expect(response.statusCode).toEqual(201)
    expect(response.body).toHaveProperty("success", true)
    expect(response.body).toHaveProperty("status", 201)
    expect(response.body).toHaveProperty("message", "User successfully created")
    expect(response.body).toHaveProperty("user", { "name": "newUser", "username": "newUser" })
  }, 100000)
  
  test('Request register user but the username is already taken', async () => {
    const response = await requestPostJSON('/register', { "username": "newUser", "password": "password", "name": "newUser" })

    expect(response.statusCode).toEqual(409)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body).toHaveProperty("status", 409)
    expect(response.body).toHaveProperty("message", "Username is already taken")
  }, 100000)

  test('Try to register a user with an invalid username', async () => {
    const response = await requestPostJSON('/register', { "username": " ", "password": "password", "name": "newUser" })

    expect(response.statusCode).toEqual(422)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body).toHaveProperty("status", 422)
    expect(response.body).toHaveProperty("message", "Username, Password, or Name do not follow criteria")
  }, 100000)

  test('Try to register a user with an invalid password', async () => {
    const response = await requestPostJSON('/register', { "username": "username", "password": " ", "name": "newUser" })

    expect(response.statusCode).toEqual(422)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body).toHaveProperty("status", 422)
    expect(response.body).toHaveProperty("message", "Username, Password, or Name do not follow criteria")
  }, 100000)

  test('Try to register a user with an invalid name', async () => {
    const response = await requestPostJSON('/register', { "username": "username", "password": "password", "name": "" })

    expect(response.statusCode).toEqual(422)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body).toHaveProperty("status", 422)
    expect(response.body).toHaveProperty("message", "Username, Password, or Name do not follow criteria")
  }, 100000)
})

/**
 * @Login_Feature_Test
 */
describe('POST /api/auth/login', () => {
  test('Log user in and receive a success status message', async () => {
    const response = await requestPostJSON('/login', { "username": "newUser", "password": "password" })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("success", true)
    expect(response.body).toHaveProperty("status", 200)
    expect(response.body).toHaveProperty("message", "User successfully logged in")
    expect(response.body).toHaveProperty("user", { "name": "newUser", "username": "newUser" })
  }, 100000)
  
  test('Attempt to log non-existent user in and receive error message', async () => {
    const response = await requestPostJSON('/login', { "username": "nonExistentUser", "password": "password" })

    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body).toHaveProperty("status", 404)
    expect(response.body).toHaveProperty("message", "Incorrect username or password")
  }, 100000)
  
  test('Attempt to log user in with incorrect password and receive an error', async () => {
    const response = await requestPostJSON('/login', { "username": "newUser", "password": "incorrectPassword" })

    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body).toHaveProperty("status", 404)
    expect(response.body).toHaveProperty("message", "Incorrect username or password")
  }, 100000)
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
