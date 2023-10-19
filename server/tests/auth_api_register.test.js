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
  const initialDBState = [
    {
      name: "ExistingUser",
      username: "ExistingUser",
      passwordHash: await bcrypt.hash("password", 10)
    }
  ]
  
  await User.deleteMany({})
  let userObject = new User(initialDBState[0])
  await userObject.save()
})

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
    const response = await requestPostJSON('/register', { "username": "ExistingUser", "password": "password", "name": "ExistingUser" })

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