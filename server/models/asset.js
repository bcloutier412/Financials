const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: String,
  assetClass: String,
  buyInPrice: Number,
  quantity: Number,
  purchaseDate: Date,
  notes: []
})

assetSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const Asset = mongoose.model('Asset', assetSchema)

module.exports = {
  Asset,
  assetSchema
}