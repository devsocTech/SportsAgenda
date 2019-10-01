import React from 'react';
import {View,Text,ImageBackground} from 'react-native';
import {Button,TextInput} from 'react-native-paper';

export default (props)=>{
    return(
        <ImageBackground source={require('./Assets/Pictures/Background.png')} style={{width: '100%', height: '100%'}}>
        <View style={{justifyContent:'center', flex:1}}>
            <TextInput style={{alignSelf:'center', width:'75%', margin:10}} label="Correo electrónico" mode="flat" onChangeText={(text)=>props.setEmail(text)}>{props.Mail}</TextInput>
 
            <TextInput secureTextEntry={true} style={{alignSelf:'center', width:'75%', margin:10}} label="Contraseña" mode="flat" onChangeText={(text)=>props.setPassword(text)}>{props.Pass}</TextInput>
            
            <Button style={{alignSelf:'center', width:'75%',margin:30}} mode="contained" onPress={()=>props.signIn()}>Iniciar Sesión</Button>
        </View>
        </ImageBackground>
    );
}