import React,{Component} from 'react'
import {ScrollView,View,Text} from 'react-native'
import {Avatar} from 'react-native-paper'

export default (props)=>{
    return(
    <View style={{height:100,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:15}}>
        <View style={{padding:10,alignItems:'center'}}>
            <Avatar.Icon size={60} icon="folder" />
            <Text>Equipo Guti</Text>
        </View>

        <View style={{alignItems:'center'}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:40,paddingHorizontal:20}}>4</Text>
            <Text style={{fontSize:24}}>vs</Text>
            <Text style={{fontSize:40,paddingHorizontal:20}}>4</Text>
        </View>
        <View>
         <Text>Finalizado 11/07/19</Text>
        </View>
        </View>
 

        <View style={{padding:10, alignItems:'center'}}>
            <Avatar.Icon size={60} icon="menu" />
            <Text>Equipo Choch</Text>
        </View>
        
        
    </View>
)
}
