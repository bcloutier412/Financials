const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  const response = await api
    .get('/api/auth/hello')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.message).toBe("hello")
}, 100000)

/** 
 * Register Feature Test
*/
test('register a user and returns success status message', async () => {
  const data = { "username": "dino1cdd", "password": "password", "name": "dino" }
  const response = await api
    .post("/api/auth/register")
    .send(data)
    .set('Accept', 'application/json');

  expect(response.statusCode).toEqual(201)
  expect(response.body).toHaveProperty("success", true)
  expect(response.body).toHaveProperty("status", 201)
  expect(response.body).toHaveProperty("message", "User successfully created")
}, 100000)

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
