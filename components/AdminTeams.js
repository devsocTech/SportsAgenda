import React,{Component} from 'react'
import {View,FlatList,TouchableOpacity} from 'react-native';
import {DefaultTheme, Button,Appbar,Text,Avatar,ActivityIndicator,Portal,Dialog} from 'react-native-paper';
import InputSpinner from "react-native-input-spinner";


export default (props)=>{
    keyId=props.keyId
    pago=props.pago

    return(
        <View style={{flexDirection:'row',justifyContent:'space-evenly',flex:1}}>
            <FlatList
            data={props.equipos}
            renderItem={({item})=>(
                <View style={{flex:1}}>
                    <TouchableOpacity onPress={()=>props.showDialog(item.idDoc)}>
                        <View style={{alignItems:'center',flexDirection:'row',justifyContent:'space-evenly'}}>
                        <View style={{flex:1,padding:20,alignItems:'center',flexDirection:'row'}}>
                            <Avatar.Icon color="white" size={60} icon="security"/>
                            <View>
                            <Text style={{paddingLeft:20,fontSize:17}} theme={theme}>{item.nombreEquipo}</Text>
                            <Text style={{paddingLeft:20,fontSize:15}} theme={theme}>{item.codigoEquipos}</Text>                                
                            </View>
                        </View>
                        <View style={{alignItems:'center',paddingRight:20}}>
                            <Text theme={theme}>Por pagar:</Text>
                            <Text style={{fontSize:16}} theme={theme}>{item.Pagos}</Text>
                        </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
            onRefresh={props.handleRefresh}
            refreshing={props.refreshing}
            keyExtractor={item=>item.idDoc}>
            </FlatList>

            <Portal>
                <Dialog
                visible={props.visible}
                onDismiss={()=>props.hideDialog()}
                theme={theme2}>
                <Dialog.Title>Registrar pago</Dialog.Title>
                <Dialog.Content>
                <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:10}}>
                <View style={{alignItems:'center',marginHorizontal:10}}>
                    <InputSpinner
                    textColor="white"
	                max={10000}
	                min={-10000}
                    step={50}
                    colorLeft="#47C9C6"
                    colorRight="#47C9C6"
                    colorPress="#47C9C6"
                    value={props.pago}
                    onChange={(num)=>props.changePago(num)}
                    />
                </View>
                </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={()=>props.hideDialog()}>Cancelar</Button>
                    <Button onPress={()=>props.registraPago(keyId,pago)}>Aceptar</Button>
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