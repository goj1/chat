const express = require("express")
const socketIo = require("socket.io")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const port = 3000


const app = express()
app.use(bodyParser.json)

const server = require("http").createServer(app)
const io = socketIo(server)

const User = require('./User')
const Chat = require('./Chat')
const Message = require('./Message')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/maria-chat', {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on('connected', () => {
  console.log("Conectado ao banco de dados Maria Chat.")
})

mongoose.connection.on('disconnected', () => {
  console.log("Desconectado do banco de dados Maria Chat.")
})

app.post('/', async (req, res) => {
  console.log('veioasdfasdf')
  let user1 = new User({name: 'Hugo Sousa'})
  let user2 = new User({name: 'Mafe'})
  await user1.save()
  await user2.save()
  res.sendStatus(200)
})

app.get('/users', async (req, res) => {
  console.log('testetw')
  let users = await User.find({})
  res.status(200).json(users)
})

//Lista todos os chat do usuário quando ele acessar essa rota. Aqui deve mostrar todos os chat em que o usuário é autor ou receptor das mensagens
app.post('/chats', async (req, res) => {
  let idUser = req.body.id
  let chats = await Chat.find({}).all('users', [idUser])
  res.status(200).json(chats)
})

//Acessa o chat existente ou cria um com os id dos usuários envolvidos
app.post('/chat', async (req, res) => {
  let users = req.body.users

  if (users && users.length > 0) {
    let chat = await Chat.find({}).all('users', users)

    //Se o chat existir cria um servidor web socket com o id do chat, pois cada chat terá seu próprop canal.
    if (chat) {
      io.on("connection", socket => {
        socket.on(`${chat._id}`, msg => {
          io.emit(`${chat._id}`, msg)
        })
      })

      res.status(200).json(chat)
    } else {
      let chatSaved = new Chat(users)
      await chatSaved.save()
      io.on("connection", socket => {
        socket.on(`${chatSaved._id}`, msg => {
          io.emit(`${chatSaved._id}`, msg)
        })
      })

      res.status(200).json(chatSaved)
    }
  } else {
      res.status(500).json({mensagem: 'Alguma mensagem aqui'})
  }
})

app.post('conversation', async (req, res) => {
  let message = req.body.message
  let newMessage = new Message(message)
  await message.save()

  io.on("connection", socket => {
    socket.on(`${message.chat}`, msg => {
      io.emit(`${message.chat}`, msg)
    })
  })

  res.sendStatus(200)
})

server.listen(port, () => console.log("Servidor rodando na porta: " + port))
