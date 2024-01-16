require('dotenv').config({ path: '../.env'});

const mongoose = require('mongoose');
const { User } = require('../models/user');

const modifyAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  
    const user = await User.find({ username: "dino12" });
  
    console.log(user)
    mongoose.disconnect()
  } catch (error) {
    console.log(error)
  }
}

modifyAllUsers();
