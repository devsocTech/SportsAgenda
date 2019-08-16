import React,{Component} from 'react';
import {View} from 'react-native';
import {DefaultTheme, Button,Appbar} from 'react-native-paper';

export default (props)=>{
    return(
        <View style={{flexDirection:'row',justifyContent:'space-evenly',flex:1}}>
            <Button compact={true} style={{justifyContent:'center',width:170,height:70,alignSelf:'center',margin:10}} theme={theme} mode='contained'
                    >
            Crear liga
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