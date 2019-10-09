import React,{Component} from 'react'
import {View,FlatList} from 'react-native';
import {Portal,Dialog,TextInput,Button,DefaultTheme,Avatar,Text} from 'react-native-paper'

 export default (props)=>{
     
     return(
    <View style={{flex:1}}>
      <FlatList
            data={props.jugadores}
            renderItem={({item})=>(
                <View>
                        <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-evenly'}}>
                        <View style={{flex:1,padding:20,alignItems:'center',flexDirection:'row'}}>
                            <Avatar.Icon color="white" size={60} icon="account-circle"/>
                            <Text style={{paddingLeft:20,fontSize:18}} theme={theme2}>{item.nombre}</Text>
                        </View>
                        </View>
                </View>
            )}
            onRefresh={props.handleRefresh}
            refreshing={props.refreshing}
            ListFooterComponent={()=><Button onPress={() => props.showDialogAgregarJugador()}> Agrega un Jugador a un equipo </Button>}>
            </FlatList>

         <Portal>
            <Dialog
             visible={props.visibleAgregarJugador}
             onDismiss={props.hideDialogAgregarJugador}
             theme={theme}>
            <Dialog.Title>Agregar Jugador</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Nombre del jugador" onChangeText={(text)=>props.setNombreJugador(text)}></TextInput>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>props.aceptarDialogAgregarJugador()}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={()=>props.hideDialogAgregarJugador()}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
        </Portal>
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

const theme2 = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: '#47C9C6',
    accent: '#47C9C6',
    background: '#3B4B61',
    text:'black',
    placeholder: '#FAFAFA',
    surface: '#3B4B61',
    disabled: 'white'
  }
};