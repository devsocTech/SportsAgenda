import React, { Component } from 'react';
import firebase from 'firebase';
import Navigator from './Navigator';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

export default class App extends Component{

  componentWillMount() {
    firebase.initializeApp({
        apiKey: 'AIzaSyCPEN9p4XV7-iGwBGJEBi2J0RUu5s7rpQM',
        authDomain: 'sports-agenda.firebaseapp.com',
        databaseURL: 'https://sports-agenda.firebaseio.com',
        projectId: 'sports-agenda',
        storageBucket: 'sports-agenda.appspot.com',
        messagingSenderId: '396222195713',
        appId: '1:396222195713:web:81bfcea373c43a02'
    });
  }

  render(){
  return (
    <PaperProvider theme={theme}>
      <Navigator/>
    </PaperProvider>
  );
};
}

const theme = {
  ...DefaultTheme,
  roundness: 100,
  colors: {
    ...DefaultTheme.colors,
    primary: '#47C9C6',
    accent: 'white',
    background: 'transparent',
    text:'white',
    placeholder: 'white',
    surface: '#EEEEEE',
    disabled: 'white'
  }
};