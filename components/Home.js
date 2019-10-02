import React,{Component} from 'react';
import {View,  StyleSheet} from 'react-native';
import {DefaultTheme, Button,Portal,TextInput, Card, Text,Dialog} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase';

export default (props)=>{
    return(
        <View style={{flex:1}}>
            
            <View style={{paddingTop:1}}>

                <View style={{justifyContent:'space-around',flexDirection:'row',paddingVertical:5,zIndex:1}}>
                    <Card theme={theme} style={{alignItems:'flex-start',height:100,width:"45%",marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:15}}>EQUIPO:</Text>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>{props.teamName}</Text>
                        </Card.Content>
                    </Card>

                    <Card theme={theme} style={{alignItems:'flex-end',height:100,width:"45%",marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:15}}>POSICIÓN:</Text>
                            <Text style={{fontSize:35,fontWeight:'bold',alignSelf:'flex-end'}}>{props.teamPos}</Text>
                        </Card.Content>
                    </Card>


                </View>

                <View style={{zIndex:2,flexDirection:'row',paddingVertical:5,justifyContent:'space-around'}}>

                    <Card theme={theme} style={{alignItems:'flex-start',height:100,width:"45%",marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:35,fontWeight:'bold'}}>{props.golesF}</Text>
                            <Text style={{fontSize:17}}>GOLES(+)</Text>
                        </Card.Content>
                    </Card>
                    

                    <Card theme={theme} style={{alignItems:'flex-end',height:100,width:"45%",marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:35,fontWeight:'bold',alignSelf:'flex-end'}}>{props.golesC}</Text>
                            <Text style={{fontSize:17}}>GOLES(-)</Text>
                        </Card.Content>
                    </Card>

                </View>

                <View style={{zIndex:3,marginTop:20,position:'absolute',height:210,width:370,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                    <Icon style={{position:'absolute'}} name="shield" color='#FAFAFA' size={160}/>
                    <Icon name="security" color='#47C9C6' size={130}/>
                </View>

        </View>
            <Button onPress={() => props.showDialogUnirteLiga()}>Crear equipo y unirte a liga</Button>
            <Button onPress={() => props.showDialogUnirteEquipo()}> Unete a un equipo </Button>

            <Portal>
            <Dialog
             visible={props.visibleUnirteLiga}
             onDismiss={props.hideDialogUnirteLiga}
             theme={theme}>
            <Dialog.Title>Crear equipo y unirte a liga</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Nombre del Equipo" onChangeText={(text)=>props.setNombreEquipo(text)}></TextInput>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Código de liga" onChangeText={(text)=>props.setCodigoLiga(text)}></TextInput>
              
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={props.aceptarDialogUnirteLiga}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={props.hideDialogUnirteLiga}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
            </Portal>

            <Portal>
            <Dialog
             visible={props.visibleUnirteEquipo}
             onDismiss={props.hideDialogUnirteEquipo}
             theme={theme}>
            <Dialog.Title>Unirte Equipo</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Nombre del Equipo" onChangeText={(text)=>props.setCodigoEquipo(text)}></TextInput>
              
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={props.aceptarDialogUnirteEquipo}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={props.hideDialogUnirteEquipo}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
            </Portal>


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
      surface: '#3B4B61',
      disabled: 'white'
    }
  };