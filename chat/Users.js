import * as React from 'react';
import {StyleSheet, View, Alert, ScrollView, useWindowDimensions, Platform} from 'react-native';
import {Header, Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons'

Icon.loadFont()

/**
 * Aqui é a lista de conversa/usuários
 */
export default function Users(props) {
  const [users, setUsers] = useState([]);
  const window = useWindowDimensions();
  const userLoggedId = Platform.OS === 'android' ? '5f23511e5ee6301a33b74e64' : '5f23511e5ee6301a33b74e65';

  function getUsers() {
    axios.get('http://192.168.0.19:3000/users').then(response => {
      let usersUpdated = response.data.filter(u => u._id !== userLoggedId)
      setUsers(usersUpdated);
    }).catch(err => {
      Alert.alert('Atenção', 'Ocorreu um erro ao carregar os usuários');
    });
  }

  function openChatUser(user) {
    props.navigation.navigate('Chat', {user})
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Header
        centerComponent={{text: 'Usuários', style: {color: '#fff'}}}
      />
      <View style={styles.container}>
        <ScrollView style={{width: window.width}}>
          {
            users.map((item, i) => (
              <ListItem
                key={item._id}
                title={item.name}
                bottomDivider
                chevron
                onPress={() => openChatUser(item)}
              />
            ))
          }
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: window.height,
    width: window.width,
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    height: window.height,
    backgroundColor: '#F5FCFF',
  },
  body: {
    backgroundColor: '#F5FCFF',
  },
});
