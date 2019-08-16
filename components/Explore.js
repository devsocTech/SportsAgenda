import React,{Component} from 'react';
import {View,ScrollView,Image} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import {DefaultTheme, Button,Portal,TextInput,Dialog,List,Text} from 'react-native-paper';
import TornCard from './TornCard';
import Header from './Header';

export default (props)=>{

    const visible=props.visible
    const visible2=props.visible2

    return(
        <View style={{flex:1}}>
        <Header Title={props.Title} visible={props.visible3} showDialog={props.showDialog3} hideDialog={props.hideDialog3} leagueSelect={props.leagueSelect} selectLeague={props.selectLeague}></Header>

        <View style={{flex:0,paddingTop:10}}>
          <ScrollView scrollEventThrottle={16}>
              <View style={{flex:1,backgroundColor:'#FAFAFA',paddingTop:20}}>
                  <Text style={{fontSize:24, fontWeight:'bold',paddingHorizontal:20}}>
                    Torneos cerca de mi
                  </Text>
                  <View style={{height:100,marginTop:20}}>
                      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                         <TornCard/>
                         <TornCard/>
                         <TornCard/>
                         <TornCard/>
                         <TornCard/>
                      </ScrollView>
                  </View>
                </View>
          </ScrollView>
          </View>

    <View style={{flex:0,paddingTop:20}}>   

        <Text style={{fontSize:24, fontWeight:'bold',paddingHorizontal:20}}>Juega Ahora</Text>

        <View style={{flex:1,paddingTop:10}}>
        

            <Button contentStyle={{width:370,height:50,alignSelf:'center'}} style={{width:370,height:50,marginHorizontal:20,marginVertical:10}} theme={theme} mode='contained'
                    onPress={()=>props.showDialog()}>
            unirte a equipo
            </Button>

            <Button  contentStyle={{width:370,height:50,alignSelf:'center'}} style={{width:370,height:50,marginHorizontal:20,marginVertical:10}} theme={theme} mode='contained'
                    onPress={()=>props.showDialog2()}>
            Unirte a liga
            </Button>

            <Portal>
            <Dialog
             visible={visible}
             onDismiss={props.hideDialog}
             theme={theme}>
            <Dialog.Title>Insertar código de equipo</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Código de equipo"></TextInput>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={props.hideDialog}>Aceptar</Button>
            </Dialog.Actions>
            </Dialog>
            </Portal>

            <Portal>
            <Dialog
             visible={visible2}
             onDismiss={props.hideDialog2}
             theme={theme}>
            <Dialog.Title>Insertar código de liga</Dialog.Title>
            <Dialog.Content>
              <TextInput style={{alignSelf:'center', width:'100%'}} label="Código de liga"></TextInput>
              <Dropdown
              baseColor="white"
              textColor="white"
              selectedItemColor="#47C9C6"
              label="Seleccionar Equipo"
              data={props.Teams}
              onChangeText={(value)=>props.selectTeam(value)}/>
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={props.hideDialog2}>Aceptar</Button>
            </Dialog.Actions>
            </Dialog>
            </Portal>



        </View>
        </View>

        

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