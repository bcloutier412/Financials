require('dotenv').config({ path: '../.env'});

const mongoose = require('mongoose');
const { User } = require('../models/user');

const modifyAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  
    await User.updateMany({}, { $set: { watchList: [] } });
  
    console.log("success")
    mongoose.disconnect()
  } catch (error) {
    console.log(error)
  }
}

modifyAllUsers();
