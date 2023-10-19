const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')

const api = supertest(app)

const requestPostJSON = (route, data) => {
  return api.post(`/api/auth/${route}`).send(data).set('Accept', 'application/json');
}

beforeAll(async () => {
  await User.deleteMany({})
  let userObject = new User({
    name: "newUser",
    username: "newUser",
    passwordHash: await bcrypt.hash("password", 10)
  });
  userObject.save();
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
  await mongoose.connection.close()
})
