const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')

const adminUser = supertest.agent(app);

const requestPostJSON = (route, data) => {
  return adminUser.post(`/api/user/${route}`).send(data).set('Accept', 'application/json');
}

const requestGetJSON = (route) => {
  return adminUser.get(`/api/user/${route}`)
}

beforeAll(async () => {
  initialDBState = [{
    name: "AdminUser",
    username: "AdminUser",
    passwordHash: await bcrypt.hash("password", 10),
    watchList: ["AAPL", "NFLX", "GOOGL"]
  }]

  await User.deleteMany({})
  let userObject = new User(initialDBState[0])
  await userObject.save()
})

/***
 * @Establish_Login
 */
describe("POST to login /api/auth/login", () => {
  test("Responds with the admin info", async () => {
    const response = await adminUser.post('/api/auth/login').send({ username:"AdminUser", password: "password" }).set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("success", true)
    expect(response.body).toHaveProperty("status", 200)
    expect(response.body).toHaveProperty("message", "User successfully logged in")
    expect(response.body).toHaveProperty("user", { "name": "AdminUser", "username": "AdminUser" })
  })
}, 10000)

/**
 * @Get_User_WatchList
 */
describe('GET Testing out the watchList API functionality, /api/user/watchList', () => {
  test('Request the users watchList data', async () => {
    const response = await requestGetJSON('/watchList');
    
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("status", 200)
    expect(response.body).toHaveProperty("message", "Sending back user watchList")
    expect(response.body).toHaveProperty("watchList", ["AAPL", "NFLX", "GOOGL"])
  })
}, 10000)

/**
 * @Add_to_User_WatchList
 */
describe('POST Testing out the add to user WatchList, /api/user/watchList/:ticker', () => {
  
})

afterAll(async () => {
  await mongoose.connection.close()
})


