import React,{Component} from 'react';
import {View,FlatList,TouchableOpacity} from 'react-native';
import InputSpinner from "react-native-input-spinner";
import {DefaultTheme, Button,Appbar,Text,Avatar,ActivityIndicator,Portal,Dialog} from 'react-native-paper';


export default (props)=>{
    keyId=props.itemKeyId
    nombreF=props.itemNombreF
    nombreV=props.itemNombreV
    golesF=props.itemGolesF
    golesV=props.itemGolesV

    return(       
        <View style={{flexDirection:'row',justifyContent:'space-evenly',flex:1}}>
            <FlatList
            data={props.team}
            renderItem={({item})=>( 
                <View>
                <TouchableOpacity onPress={()=>props.showDialog(item.keyId,item.nombreEquipoF,item.nombreEquipoV,item.golesF,item.golesV)}>
                <View  style={{flex:5,height:100,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:15}}>

                <View style={{flex:2,padding:10,alignItems:'center'}}>
                    <Avatar.Icon color="white" size={60} icon="security"/>
                    <Text theme={theme} style={{textAlign:'center'}}>{item.nombreEquipoF}</Text>
                </View>
        
                <View style={{alignItems:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text theme={theme} style={{fontSize:40,paddingHorizontal:20}}>{item.golesF}</Text>
                    <Text theme={theme} style={{fontSize:24}}>vs</Text>
                    <Text theme={theme} style={{fontSize:40,paddingHorizontal:20}}>{item.golesV}</Text>
                </View>
                <View>
                 <Text theme={theme}>{item.stringDate}</Text>
                </View>
                </View>
         
        
                <View style={{flex:2,padding:10, alignItems:'center'}}>
                    <Avatar.Icon color="white" size={60} icon="security" />
                    <Text theme={theme} style={{textAlign:'center'}}>{item.nombreEquipoV}</Text>
                </View>
            </View>

            </TouchableOpacity>
            
            </View>

            )}
            keyExtractor={item=>item.keyId}
            onRefresh={props.handleRefresh}
            refreshing={props.refreshing}>
            </FlatList>

            <Portal theme={theme2}>
            <Dialog
             visible={props.visible}
             onDismiss={()=>props.hideDialog()}
             theme={theme2}>
            <Dialog.Title>Registrar marcador</Dialog.Title>
            <Dialog.Content>
                
                <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:10}}>
                <View style={{alignItems:'center',marginHorizontal:10}}>
                    <InputSpinner
                    textColor="white"
	                max={100}
	                min={0}
                    step={1}
                    colorLeft="#47C9C6"
                    colorRight="#47C9C6"
                    colorPress="#47C9C6"
                    value={golesF}
                    onChange={(num)=>props.changeF(num)}
                    />
                    <Text style={{marginTop:5}}>{nombreF}</Text>
                </View>

                <View style={{alignItems:'center',marginHorizontal:10}}>
                    <InputSpinner
                    textColor="white"
	                max={100}
	                min={0}
                    step={1}
                    colorLeft="#47C9C6"
                    colorRight="#47C9C6"
                    colorPress="#47C9C6"
                    value={golesV}
                    onChange={(num)=>props.changeV(num)}
                    />
                    <Text style={{marginTop:5}}>{nombreV}</Text>
                </View>
                </View>

            <Dialog.Actions>
            <Button onPress={()=>props.cancelarPartido(keyId)}>Cancelar el Partido</Button>
            </Dialog.Actions>

            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={()=>props.hideDialog()}>Cancelar</Button>
              <Button onPress={()=>props.registraPartido(keyId,golesF,golesV)}>Aceptar</Button>
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
      text:'#1E1E1E',
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