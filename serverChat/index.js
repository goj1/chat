const express = require("express")
const socketIo = require("socket.io")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const port = 3000


const app = express()
app.use(bodyParser.json())

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

app.get('/', async (req, res) => {
  //Usuários drafts
  // let user1 = new User({name: 'Android User'})
  // let user2 = new User({name: 'iPhone User'})
  // await user1.save()
  // await user2.save()
  // res.sendStatus(200)
  res.send('Servidor rodando zerado!')
})

/**
 * Lista os usuários cadastrados
 */
app.get('/users', async (req, res) => {
  let users = await User.find({})
  res.status(200).json(users)
})

/**
 * Lista todos os chat do usuário quando ele acessar essa rota. Aqui deve mostrar todos os chat em que o usuário é autor ou receptor das mensagens.
 * Essa funcionalidade não está sendo usada pois um chat é um usuário então quando clica em um usuário da lista de contato um chat é criado automaticamente,
 * Então essa funcionalidade meio que ficou inútil, mas pode ser usada...
 */
app.post('/chats', async (req, res) => {
  let idUser = req.body.id
  let chats = await Chat.find({}).all('users', [idUser])
  res.status(200).json(chats)
})

/**
 * Quando um usuário da lista de contatos é clicado vai pra tela de chat com esse usuário, se não tiver um chat ele é criado automaticamente.
 * Se houver conversas ela é carregada.
 * Essa rota pode ser substituída pelo evento on do io. Ainda não testei, mas pode ser mais vantajoso.
 */
app.post('/chat', async (req, res) => {
  let users = req.body.users

  if (users && users.length > 0) {
    let chat = await Chat.findOne({}).all('users', users)

    //Se o chat existir cria um servidor web socket com o id do chat, pois cada chat terá seu próprop canal.
    if (chat) {
      let messages = await Message.find({chat: chat._id})
      res.status(200).json({chat, messages})
    } else {
      let chatSaved = new Chat({users})
      await chatSaved.save()
      res.status(200).json({chat: chatSaved, messages: []})
    }
  } else {
      res.status(500).json({mensagem: 'Ops! Erro ao acessar o chat.'})
  }
})

/**
 * Quando uma mensagem é enviada, ela é salva e um evento é enviado para o cliente do socketio que está no app.
 * Porém tem um pequeno erro aqui, quando o receptor entra na conversa, ele só será notificado quando envia uma mensagem.
 * Pois do lado do app é só nesse momento que ele se registra no cliente do socketio. Eu ainda não sei o ponto para criar um cliente do socket quando
 * o usuário entra na tela.
 * Pelo que andei pesquisando, todas essas rotas podem ser substituídas por um único cliente e um único server do socketio. Mas não testei.
 */
app.post('/conversation', async (req, res) => {
  let message = req.body.message
  let newMessage = new Message(message)
  await newMessage.save()
  io.emit(`${message.chat}`, newMessage)
  res.sendStatus(200)
})

server.listen(port, () => console.log("Servidor rodando na porta: " + port))
