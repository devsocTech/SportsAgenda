import React,{Component} from 'react';
import {View,  StyleSheet,RefreshControl} from 'react-native';
import {DefaultTheme, Button,Portal,TextInput, Dialog,Card,Text} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';


export default (props)=>{

  
  var label1 = {label: 'Equipo a favor'};
  var label2 = {label: 'Equipo en contra'};
  var array = props.nombreEquipos;


    return(
        <View style={{flex:1}}>
          <ScrollView
                refreshControl={
                  <RefreshControl refreshing={props.refreshing} onRefresh={props.handleRefresh}/>}>          
          <View style={{paddingTop:1}}>
          <View style={{justifyContent:'space-around',flexDirection:'row',paddingVertical:5,zIndex:1}}>
                    <Card theme={theme} style={{alignItems:'flex-start',height:100,width:"45%",marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:15}}>CÓDIGO</Text>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>{props.codigoliga}</Text>
                        </Card.Content>
                    </Card>

                    <Card theme={theme} style={{alignItems:'flex-end',height:100,width:"45%",marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:15,alignSelf:'flex-end'}}>EQUIPO LIDER</Text>
                            <Text style={{fontSize:20,fontWeight:'bold',alignSelf:'flex-end',textAlign:'right'}}>{props.equipoLider}</Text>
                        </Card.Content>
                    </Card>


                </View>

                <View style={{zIndex:2,flexDirection:'row',paddingVertical:5,justifyContent:'space-around'}}>

                    <Card theme={theme} style={{alignItems:'flex-start',height:100,width:"45%",marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:35,fontWeight:'bold'}}>{props.jornada}</Text>
                            <Text style={{fontSize:17,alignSelf:'flex-end'}}>JORNADA</Text>
                        </Card.Content>
                    </Card>
                    

                    <Card theme={theme} style={{alignItems:'flex-end',height:100,width:"45%",marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{paddingTop:12,fontSize:25,fontWeight:'bold',alignSelf:'flex-end'}}>${props.cobranza}</Text>
                            <Text style={{fontSize:17,alignSelf:'flex-end'}}>COBRANZA</Text>
                        </Card.Content>
                    </Card>

                </View>

                <View style={{zIndex:3,marginTop:20,position:'absolute',height:210,width:370,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                    <Icon style={{position:'absolute'}} name="shield" color='#FAFAFA' size={160}/>
                    <Icon name="security" color='#47C9C6' size={130}/>
                </View>

          </View>

            <Button onPress={() => props.showDialogAgregarLiga()}> Crear Liga</Button>
            <Button onPress={() => props.showDialogProgramarPartido()}> Programa un partido </Button>
            <Button onPress={() => props.showDialogCrearEquipo()}> Agregar Equipo</Button>

            <Portal>
            <Dialog
             visible={props.visibleProgramarPartido}
             onDismiss={props.hideDialogProgramarPartido}
             theme={theme}>
            <Dialog.Title>Programar Partido</Dialog.Title>
            <Dialog.Content >

            <RNPickerSelect
            placeholder = {label1}
            placeholderTextColor='white'
            onValueChange={(value) => props.setselecEquipo1(value)}
            items={array}
            style={pickerSelectStyles}/>

            <RNPickerSelect
            placeholder = {label2}
            placeholderTextColor = 'white'
            onValueChange={(value) => props.setselecEquipo2(value)}
            items={array}
            style={pickerSelectStyles}/>


            <DatePicker
            style={{width: 275, alignSelf:'center'}}
            date = {props.dateParti}
            placeholder="Fecha del Partido"
            placeholderTextColor = "white"
            mode="datetime"
            format="YYYY-MM-DD HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={(date) => props.setdateParti(date)}
            customStyles={{dateInput: {},
            placeholderText: {
              color: 'white'
            },
            dateText:{
              color: 'white',
              justifyContent: 'flex-start'
            }
          }}
        />
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={()=>props.aceptarDialogProgramarPartido()}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={()=>props.hideDialogProgramarPartido()}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
            
        </Portal>

        <Portal>
            <Dialog
             visible={props.visibleCrearEquipo}
             onDismiss={props.hideDialogCrearEquipo}
             theme={theme}>
            <Dialog.Title>Crear equipo</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Nombre del Equipo" onChangeText={(text)=>props.setNombreEquipo(text)}>{props.nombreEquipo}</TextInput>
              
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={()=>props.aceptarDialogCrearEquipo()}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={()=>props.hideDialogCrearEquipo()}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
          </Portal>

        <Portal>
            <Dialog
             visible={props.visibleAgregarLiga}
             onDismiss={props.hideDialogAgregarLiga}
             theme={theme}>
            <Dialog.Title>Agregar Liga</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Nombre de la liga" onChangeText={(text)=>props.setNombreLiga(text)} >{props.nombreLiga}</TextInput>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Costo por equipo" onChangeText={(value)=>props.setcostoliga(value)}></TextInput>
            
            </Dialog.Content>
    
            <Dialog.Actions>
              <Button onPress={()=>props.aceptarDialogAgregarLiga()}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={()=>props.hideDialogAgregarLiga()}>Cancelar</Button>
            </Dialog.Actions>
            </Dialog>
            </Portal>
            </ScrollView>

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

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'white',
      paddingRight: 30, 
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'white',
      paddingRight: 30, 
    },
  });