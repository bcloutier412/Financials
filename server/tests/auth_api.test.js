const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { User } = require('../models/user')

const api = supertest(app)

test('notes are returned as json', async () => {
  const response = await api
    .get('/api/auth/hello')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.message).toBe("hello")
}, 100000)

/** 
 * @Register_Feature_Test
*/
describe('POST /api/auth/register', () => {
  test('Register a user and receive success status message', async () => {
    const data = { "username": "newUser", "password": "password", "name": "newUser" }
    const response = await api
      .post("/api/auth/register")
      .send(data)
      .set('Accept', 'application/json');
  
    expect(response.statusCode).toEqual(201)
    expect(response.body).toHaveProperty("success", true)
    expect(response.body).toHaveProperty("status", 201)
    expect(response.body).toHaveProperty("message", "User successfully created")
  }, 100000)
  
  test('Request register user but the username is already taken', async () => {
    const data = { "username": "newUser", "password": "password", "name": "newUser" }
    const response = await api
      .post("/api/auth/register")
      .send(data)
      .set('Accept', 'application/json');
  
    expect(response.statusCode).toEqual(409)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body).toHaveProperty("status", 409)
    expect(response.body).toHaveProperty("message", "Username is already taken")
  }, 100000)
})

/**
 * @Login_Feature_Test
 */
describe('POST /api/auth/login', () => {
  test('Log user in and receive a success status message', async () => {
    const data = { "username": "newUser", "password": "password" }
    const response = await api
      .post("/api/auth/login")
      .send(data)
      .set('Accept', 'application/json');
    
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("success", true)
    expect(response.body).toHaveProperty("status", 200)
    expect(response.body).toHaveProperty("message", "User successfully logged in")
  }, 100000)
  
  test('Attempt to log non-existent user in and receive error message', async () => {
    const data = { "username": "nonExistentUser", "password": "password" }
    const response = await api
      .post("/api/auth/login")
      .send(data)
      .set('Accept', 'application/json');
    
    expect(response.statusCode).toEqual(404)
    expect(response.body).toHaveProperty("success", false)
    expect(response.body).toHaveProperty("status", 404)
    expect(response.body).toHaveProperty("message", "Incorrect username or password")
  }, 100000)
  
  test('Attempt to log user in with incorrect password and receive an error', async () => {
    const data = { "username": "newUser", "password": "incorrectPassword" }
    const response = await api
      .post("/api/auth/login")
      .send(data)
      .set('Accept', 'application/json');
    
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
