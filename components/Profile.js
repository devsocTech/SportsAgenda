import React,{Component} from 'react';
import {View} from 'react-native';
import {DefaultTheme, Button,Avatar, Text} from 'react-native-paper';

export default (props)=>{
    return(
        <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
            <Avatar.Icon size={100} icon="account-circle"/>
            <Text style={{padding:20,fontSize:20}}>Luis Gutiérrez</Text>            
            <Button compact={true} style={{justifyContent:'center',width:170,height:70,alignSelf:'center',margin:10}} theme={theme} mode='text'
                    >
            Cerrar Sesión
            </Button>
        </View>
    );
}

const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: '#47C9C6',
      accent: '#47C9C6',
      background: '#3B4B61',
      text:'white',
      placeholder: '#FAFAFA',
      surface: 'red',
      disabled: 'white'
    }
  };