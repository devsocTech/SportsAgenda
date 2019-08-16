import React from 'react';
import {View,ImageBackground} from 'react-native';
import {Button,DefaultTheme} from 'react-native-paper';


export default (props)=>{
    return(
        <ImageBackground source={require('./Assets/Pictures/WelcomeScreen.png')} style={{justifyContent: 'center', width: '100%', height: '100%'}}>
        <View style={{flex:0, paddingTop:'30%'}}>
            <Button theme={theme} style={{backgroundColor:'white',width: '75%', alignSelf:'center', margin:15}} onPress={()=>props.navigationAction2()} mode="contained">Iniciar Sesión</Button>
            <Button theme={theme} style={{borderWidth:2,borderColor: 'white',width: '75%', alignSelf:'center', margin:20}} onPress={()=>props.navigationAction1()} mode="outlined">Registrarse</Button>
        </View>
        </ImageBackground>
    );
}

const theme = {
    ...DefaultTheme,
    roundness: 100,
    colors: {
      ...DefaultTheme.colors,
      primary: 'white',
      background: 'transparent',
      text:'white',
      placeholder: 'white',
      surface: 'red',
      disabled: 'white'
    }
  };