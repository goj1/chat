const mongoose = require('mongoose')

const Messages = new mongoose.Schema({
  text: String,
  chat: {
    type: String,
    ref: 'Chat'
  },
  sender: {
    type: String,
    ref: 'User'
  },
  receiver: {
    type: String,
    ref: 'User'
  },
  image: String,
  createdAt: {
    type: Date,
    default: new Date()
  },
})

module.exports = mongoose.model('Messages', Messages)
