const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const { User } = require('../models/user')

const adminUser = supertest.agent(app);

const requestPostJSON = (route) => {
  return adminUser.post(`/api/user/${route}`)
}

const requestGetJSON = (route) => {
  return adminUser.get(`/api/user/${route}`)
}

const requestDeleteTicker = (route) => {
  return adminUser.delete(`/api/user/${route}`)
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
    const response = await adminUser.post('/api/auth/login').send({ username: "AdminUser", password: "password" }).set('Accept', 'application/json');

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
    const response = await requestGetJSON('watchList');

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("status", 200)
    expect(response.body).toHaveProperty("message", "Sending back user watchList")
    expect(response.body).toHaveProperty("watchList", ["AAPL", "NFLX", "GOOGL"])
  })
}, 10000)

/**
 * @Add_to_User_WatchList
 */
describe('POST Testing out th add to user WatchList, /api/user/watchList/:ticker', () => {
  test('Request to add a ticker to the user watchList', async () => {
    const response = await requestPostJSON('watchList/AMZN');

    expect(response.statusCode).toEqual(201)
    expect(response.body).toHaveProperty("status", 201)
    expect(response.body).toHaveProperty("message", "AMZN has been successfully added")
    expect(response.body).toHaveProperty("ticker", "AMZN")
  })

  test('Request to add a ticker that already exits in the watchList', async () => {
    const alreadyExistingTicker = 'AMZN';
    const response = await requestPostJSON(`watchList/${alreadyExistingTicker}`);

    expect(response.statusCode).toEqual(409)
    expect(response.body).toHaveProperty("status", 409)
    expect(response.body).toHaveProperty("message", `${alreadyExistingTicker} is already on the watch list`)
  })

  test('Request to add a ticker but did not give a valid ticker', async () => {
    const randomTicker = 'wdawdawdawdada';
    const response = await requestPostJSON(`watchList/${randomTicker}`);

    expect(response.statusCode).toEqual(422)
    expect(response.body).toHaveProperty("status", 422)
    expect(response.body).toHaveProperty("message", `${randomTicker.toUpperCase()} is not a valid ticker`)
  })
}, 10000)

/**
 * @Get_User_WatchList_After_Adding
 */
describe('GET Testing out the watchList API functionality, /api/user/watchList', () => {
  test('Request the users watchList data', async () => {
    const response = await requestGetJSON('watchList');

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("status", 200)
    expect(response.body).toHaveProperty("message", "Sending back user watchList")
    expect(response.body).toHaveProperty("watchList", ["AAPL", "NFLX", "GOOGL", "AMZN"])
  })
}, 10000)

/**
 * @Delete_From_User_WatchList
 */
describe('DELETE testing out deleting a ticker from the users watchList', () => {
  test('Request to delete a ticker from the users watchList', async () => {
    const response = await requestDeleteTicker('watchList/AMZN');

    expect(response.statusCode).toEqual(204);
  })
}, 10000)

/**
 * @Get_User_WatchList_After_Deleting
 */
describe('GET Testing out the watchList API functionality, /api/user/watchList', () => {
  test('Request the users watchList data', async () => {
    const response = await requestGetJSON('watchList');

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("status", 200)
    expect(response.body).toHaveProperty("message", "Sending back user watchList")
    expect(response.body).toHaveProperty("watchList", ["AAPL", "NFLX", "GOOGL"])
  })
}, 10000)

afterAll(async () => {
  await mongoose.connection.close()
})


