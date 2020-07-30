import * as React from 'react'
import {Header, Text} from 'react-native-elements'
import {ScrollView, StyleSheet, TextInput, useWindowDimensions, View} from 'react-native';
import {useState} from 'react';
import {Colors} from "react-native/Libraries/NewAppScreen";
import io from 'socket.io-client';

export function Chat(props) {
    const window = useWindowDimensions();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState({});
    const [chat, setChat] = useState({});

    function submitChatMessage() {
        socket.emit('', chat);
        setChat('');
    }

    // socket = io('http://192.168.0.19:3000')

    // socket.on('chat message', msg => {
    //     let mgss = chatMessages
    //     mgss.push(msg)
    //     setChatMessages(mgss)

    // })

    return (
        <>
            <Header
                leftComponent={{ icon: 'home', color: '#fff' }}
                centerComponent={{ text: 'Chat', style: { color: '#fff' } }}
            />
            <View>
            <Text h1>Chat</Text>

            <ScrollView
                style={styles.scrollView}>

                {
                    messages.map(m => (
                        <Text key={Date.now()} style={{borderWidth: 2}}>{m}</Text>
                    ))
                }

            </ScrollView>
            <TextInput
                style={{height: 40, borderWidth: 2}}
                autoCorrect={false}
                value={message}
                onSubmitEditing={() => submitChatMessage()}
                onChangeText={msg => {
                    setChat(msg)
                }}
            />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'flex-end',
        justifyContent: 'flex-end',
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
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#212121',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});
