import React,{Component} from 'react'
import {View} from 'react-native';

 export default (props)=>{
     
     return(
    <View style={{flex:1}}>
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