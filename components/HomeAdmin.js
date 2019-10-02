import React,{Component} from 'react';
import {View,  StyleSheet} from 'react-native';
import {DefaultTheme, Button,Portal,TextInput, Dialog} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';

export default (props)=>{

  const datetime = props.dateParti;
  var label1 = {label: 'Equipo a favor'};
  var label2 = {label: 'Equipo en contra'};
  var array = props.nombreEquipos;

    return(
        <View style={{flex:1,justifyContent:'center'}}>
            <Button onPress={() => props.showDialogAgregarLiga()}> Crear Liga</Button>
            <Button onPress={() => props.showDialogProgramarPartido()}> Programa un partido </Button>

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
            date = {datetime}
            mode="datetime"
            format="YYYY-MM-DD HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={(date) => props.setdateParti(date)}
            customStyles={{dateInput: {},
            placeholderText: {
              color: '#234456'
            },
            dateText:{
              color: 'white',
              justifyContent: 'flex-start'
            }
        }}
        />
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={props.aceptarDialogProgramarPartido}>Aceptar</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={props.hideDialogProgramarPartido}>Cancelar</Button>
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