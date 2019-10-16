import React,{Component} from 'react'
import {ScrollView,View,Dimensions,RefreshControl} from 'react-native'
import {Text,Avatar,DefaultTheme,Portal,Dialog,Button} from 'react-native-paper'


export default (props)=>{
    let rows=[];
    var array=props.team
    for (let i=0;i<array.length;i++){
        rows.push(
        <View  style={{flex:5,height:100,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:15}}>

        <View style={{flex:2,padding:10,alignItems:'center'}}>
            <Avatar.Icon color="white" size={60} icon="security"/>
            <Text theme={theme} style={{textAlign:'center'}}>{array[i].nombreEquipoF}</Text>
        </View>

        <View style={{alignItems:'center'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text onPress={()=>props.showDialog()} theme={theme} style={{fontSize:40,paddingHorizontal:20}}>{array[i].golesF}</Text>
            <Text onPress={()=>props.showDialog()} theme={theme} style={{fontSize:24}}>vs</Text>
            <Text onPress={()=>props.showDialog()} theme={theme} style={{fontSize:40,paddingHorizontal:20}}>{array[i].golesV}</Text>
        </View>
        <View>
         <Text theme={theme}>{array[i].stringDate}</Text>
        </View>
        </View>
 

        <View style={{flex:2,padding:10, alignItems:'center'}}>
            <Avatar.Icon color="white" size={60} icon="security" />
            <Text theme={theme} style={{textAlign:'center'}}>{array[i].nombreEquipoV}</Text>
        </View>
    </View>
        )
    }

    return(
    <View style={{flex:1}}>

        <View style={{flex:1,width: Dimensions.get('window').width}}>
        <ScrollView 
        refreshControl={
        <RefreshControl refreshing={props.refreshing} onRefresh={props.handleRefresh}
        showsVerticalScrollIndicator={false}/>}>
            {rows}
        </ScrollView>
        </View>
    </View>
    )
}

const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: '#47C9C6',
      accent: 'white',
      background: 'transparent',
      text:'#1E1E1E',
      placeholder: 'white',
      surface: '#3B4B61',
      disabled: 'white'
    }
  };

