import React from 'react';
import {View,ImageBackground} from 'react-native';
import {Switch,TextInput,Button,Subheading} from 'react-native-paper';

export default (props)=>{

    const isSwitchOn=props.Admin
    return(

        <ImageBackground source={require('./Assets/Pictures/Background.png')} style={{width: '100%', height: '100%'}}>
        <View style={{justifyContent:'center', flex:1}}>
            <TextInput style={{alignSelf:'center', width:'75%'}} label="Nombre" onChangeText={(text)=>props.setName(text)}>{props.Nombre}</TextInput>
            <TextInput style={{alignSelf:'center', width:'75%'}} label="Apellido" onChangeText={(text)=>props.setLastName(text)}>{props.Apellido}</TextInput>
            <TextInput style={{alignSelf:'center', width:'75%'}} label="Correo Electrónico" onChangeText={(text)=>props.setEmail(text)}>{props.Mail}</TextInput>
            <TextInput secureTextEntry={true} style={{alignSelf:'center' , width:'75%'}} label="Contraseña" onChangeText={(text)=>props.setPassword1(text)}>{props.Pass}</TextInput>
            <TextInput secureTextEntry={true} style={{alignSelf:'center', width:'75%'}} label="Confirmar Contraseña" onChangeText={(text)=>props.setPassword2(text)}>{props.Pass2}</TextInput>
            
            <View style={{flexDirection:'row',paddingTop:20,paddingLeft:15,alignSelf:'center', width:'75%'}}>
            <Subheading style={{paddingRight:10}}>Soy Admin</Subheading>
            <Switch color="#47C9C6" value={isSwitchOn} onValueChange={()=>props.setAdmin(!isSwitchOn)}></Switch>
            </View>

            <Button style={{alignSelf:'center', width:'75%', margin:15}} mode="contained" onPress={()=>props.createUser()}>Registrarse</Button>
        </View>
        </ImageBackground>

    );
}