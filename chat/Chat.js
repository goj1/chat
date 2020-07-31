import * as React from 'react';
import {Header, Text, Button, Input} from 'react-native-elements';
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import io from 'socket.io-client';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'

Icon.loadFont()

const width = Dimensions.get('window').width

export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(null);
  const {user} = props.route.params;
  //Aqui eu estou subistituindo o usuário logado por um já cadastro no vando e só seto o usuário de acordo coma plataforma
  const userLoggedId = Platform.OS === 'android' ? '5f23511e5ee6301a33b74e64' : '5f23511e5ee6301a33b74e65';
  const [inputRef, setInputRef] = useState(null);
  const socket = io('http://192.168.0.19:3000');

  /**
   * Aqui é o único ponto em que o usuário se conecta ao cliente co socketio,
   * É preciso haver outro ponto para ele se conectar ao acessar a página pois ele vai ficar
   * atrasado na conversa.
   */
  function sendMessage() {
    let newMessage = {
      text: message,
      chat: chat._id,
      sender: userLoggedId,
      receiver: user._id
    }

    axios.post('http://192.168.0.19:3000/conversation', {message: newMessage}).then(response => {
      if (response.status === 200) {
        socket.on(`${chat._id}`, msg => {
          setMessages([...messages, msg])
        })
      }
    }).catch(err => {
      Alert.alert('Atenção', 'Ocorreu um erro ao carregar mensagens.');
    });

    inputRef.clear();
    setMessage('');
  }

  function initalizeChat() {
    axios.post('http://192.168.0.19:3000/chat', {users: [user._id, userLoggedId]}).then(response => {
      setChat(response.data.chat);
      setMessages(response.data.messages);
    }).catch(err => {
      Alert.alert('Atenção', 'Ocorreu um erro ao iniciar o chat.');
    });
  }

  useEffect(() => {
    initalizeChat();
  }, []);

  return (
    <>
      <Header
        centerComponent={{text: `Chat ${user.name}`, style: {color: '#fff'}}}
      />
      <View style={[styles.container]}>
        <ScrollView>
          {
            messages.map(m => (
              <View key={m._id} style={{width: width, alignItems: userLoggedId === m.sender ? 'flex-end' : 'flex-start'}}>
                <Text style={{borderWidth: 2, width: width * .5, flexWrap: 'wrap'}}>{m.text}</Text>
              </View>
            ))
          }
        </ScrollView>

        <View style={{width: width, flexDirection: 'row'}}>
          <Input
            ref={input => setInputRef(input)}
            containerStyle={{width: width * .85,}}
            autoCorrect={false}
            value={message}
            onChangeText={msg => {
              setMessage(msg);
            }}
            placeholder='Mensagem'
          />
          <Button
            title={'Enviar'}
            onPress={() => sendMessage()}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: width,
    backgroundColor: '#F5FCFF',
  },
});
