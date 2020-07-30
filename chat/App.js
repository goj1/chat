import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    useWindowDimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Users from './Users'


const Stack = createStackNavigator();

const App: () => React$Node = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator headerMode={'none'}>
                <Stack.Screen name="Users" component={Users} />
            </Stack.Navigator>
        </NavigationContainer>
    );

};

export default App;

