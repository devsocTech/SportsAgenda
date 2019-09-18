import React,{Component} from 'react';
import {View} from 'react-native';
import {DefaultTheme, Button,Portal,TextInput, Card, Text,Dialog} from 'react-native-paper';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';

export default (props)=>{

    const visibleAgregarLiga=props.visibleAgregarLiga
    const visibleUnirteLiga=props.visibleUnirteLiga
    const visibleCrearEquipo=props.visibleCrearEquipo
    const visibleUnirteEquipo = props.visibleUnirteEquipo
    const visibleProgramarPartido = props.visibleProgramarPartido

    let data=[];
    var array = props.nombreEquipos;
    /*for (let i=0;i<array.length;i++){
         data.push(array[i].nombreEquipo)
     }
    //console.log(data+"Ya esta en home");*/
  

    return(
        <View style={{flex:1}}>
            
            <View style={{paddingTop:25}}>

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

                <View style={{zIndex:3,marginTop:30,position:'absolute',height:210,width:370,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                    <Icon style={{position:'absolute'}} name="shield" color='#FAFAFA' size={160}/>
                    <Icon name="security" color='#47C9C6' size={130}/>
                </View>

            <Portal>
            <Dialog
             visible={visibleAgregarLiga}
             onDismiss={props.hideDialogAgregarLiga}
             theme={theme}>
            <Dialog.Title>Agregar Liga</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Nombre de la liga" onChangeText={(text)=>props.setNombreLiga(text)}></TextInput>
            </Dialog.Content>
    
            <Dialog.Actions>
              <Button onPress={props.aceptarDialogAgregarLiga}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={props.hideDialogAgregarLiga}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
            </Portal>

            
            <Portal>
            <Dialog
             visible={visibleUnirteLiga}
             onDismiss={props.hideDialogUnirteLiga}
             theme={theme}>
            <Dialog.Title>Insertar código de liga</Dialog.Title>
            <Dialog.Content>
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
             visible={visibleCrearEquipo}
             onDismiss={props.hideDialogCrearEquipo}
             theme={theme}>
            <Dialog.Title>Crear Equipo</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Nombre del Equipo" onChangeText={(text)=>props.setNombreEquipo(text)}></TextInput>
              
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={props.aceptarDialogCrearEquipo}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={props.hideDialogCrearEquipo}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
            </Portal>

            <Portal>
            <Dialog
             visible={visibleUnirteEquipo}
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
            
        <Portal>
            <Dialog
             visible={visibleProgramarPartido}
             onDismiss={props.hideDialogProgramarPartido}
             theme={theme}>
            <Dialog.Title>Programar Partido</Dialog.Title>
            <Dialog.Content>
            <RNPickerSelect
            onValueChange={(value) => props.setselecEquipo1(value)}
            items={array}/>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={props.aceptarDialogProgramarPartido}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={props.hideDialogProgramarPartido}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
        </Portal>


        </View>
            <Button onPress={() => firebase.auth().signOut()}> Cerrar Sesión </Button>
            <Button onPress={() => props.showDialogAgregarLiga()}> Agregar liga (y generar sus codigos) </Button>
            <Button onPress={() => props.showDialogUnirteLiga()}> Unirte a liga con codigo </Button>
            <Button onPress={() => props.showDialogCrearEquipo()}> Crea tu equipo </Button>
            <Button onPress={() => props.showDialogUnirteEquipo()}> Unete a un equipo </Button>
            <Button onPress={() => props.showDialogProgramarPartido()}> Programa un partido </Button>
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