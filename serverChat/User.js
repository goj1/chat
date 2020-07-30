const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
  name: String,
  photo: String,
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model("Users", UserSchema)
