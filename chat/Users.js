import * as React from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import {Header, Text} from 'react-native-elements';
import {SafeAreaView} from 'react-native';
import {Colors} from "react-native/Libraries/NewAppScreen";
import {useEffect, useState} from 'react';
import axios from 'axios'

export default function Users(props) {
    const [users, setUsers] = useState([]);

    function getUsers() {
        axios.get('http://192.168.0.19:3000/users').then(response => {
            setUsers(response.data);
            console.log(response);
        }).catch(err => {
            Alert.alert('Atenção', 'Ocorreu um erro ao carrgar os usuários');
        });
    }

    useEffect( () => {
        getUsers()
    }, [])

    return (
        <>
            <Header
                centerComponent={{text: 'Usuários', style: {color: '#fff'}}}
            />
            <View style={styles.container}>
                <Text h1>Usuário</Text>
            </View>
        </>
    )
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
        backgroundColor: Colors.lighter,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
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
