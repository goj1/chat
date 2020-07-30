const mongoose = require("mongoose")

const ChatSchema = mongoose.Schema({
  users: [{
    type: String,
    ref: 'User'
  }],
})

module.exports = mongoose.model("Chats", ChatSchema)
