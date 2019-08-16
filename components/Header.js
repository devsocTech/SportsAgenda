import * as React from 'react';
import {View} from 'react-native';
import { Appbar,DefaultTheme,Text,Portal,Dialog,Button,RadioButton} from 'react-native-paper';

export default (props)=>{

  const select=props.nleagueSelect

  let rows=[];
  let array=props.ligas;
  let ligas=props.nLigas;
    /*for (let i=0;i<array.length;i++){
        rows.push(<View style={{flexDirection:'row'}}>
        <RadioButton value={array[i]}/>
        <Text style={{alignSelf:'center'}}>{ligas[10]}</Text>
      </View>)
    }*/
  
    return (
      <View>
      <Appbar.Header style={{paddingTop:20}} theme={theme}>
        <Appbar.Content
        title={props.Title}
        titleStyle={{fontSize:29, fontWeight:'bold',alignSelf:'flex-start'}}/>

        <Appbar.Content
        subtitle={select}
        subtitleStyle={{alignSelf:'flex-end',paddingBottom:25,fontWeight:'bold'}}
        onPress={()=>props.showDialog()}>
        </Appbar.Content>

        <Appbar.Action icon="arrow-drop-down" onPress={()=>props.showDialog()}/>
      </Appbar.Header>

      <Portal>
            <Dialog
             visible={props.visible}
             onDismiss={props.hideDialog}
             theme={theme2}>
            <Dialog.Title>Seleccionar Liga</Dialog.Title>
            <Dialog.Content>

            <RadioButton.Group
              onValueChange={(value)=>props.selectLeague(value)}
              value={select}
            >
        {rows}
      </RadioButton.Group>
              
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={props.hideDialog}>Aceptar</Button>
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
      primary: '#FAFAFA',
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
      text:'white',
      placeholder: '#FAFAFA',
      surface: '#3B4B61',
      disabled: 'white'
    }
  };