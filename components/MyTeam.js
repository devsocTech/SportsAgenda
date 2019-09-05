import React,{Component} from 'react'
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DefaultTheme, Button,Portal,TextInput,Dialog} from 'react-native-paper';
import Header from './Header';
import Player from './Player';

 export default (props)=>{
     let rows=[];
     for (let i=0;i<20;i++){
         rows.push(Player)
     }


     return(
    <View style={{flex:1}}>

        <View>
        <ScrollView>
            {rows}
        </ScrollView>
        </View>

        <View>

        </View>

        <Portal>
            <Dialog
             visible={props.visibleAgregarJugador}
             onDismiss={props.hideDialogAgregarJugador}
             theme={theme}>
            <Dialog.Title>Agregar Jugador</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Nombre del Equipo" onChangeText={(text)=>props.setNombreJugador(text)}></TextInput>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={props.aceptarDialogAgregarJugador}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={props.hideDialogAgregarJugador}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
        </Portal>

        
        <Button onPress={() => props.showDialogAgregarJugador()}> Agrega un Jugador a un equipo </Button>


    </View>
     )
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
      surface: '#3B4B61',
      disabled: 'white'
    }
  };