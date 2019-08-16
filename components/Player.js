import React,{Component} from 'react'
import {ScrollView,View,Text} from 'react-native'
import {Avatar} from 'react-native-paper'

export default (props)=>{
    return(
    <View style={{height:100,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginVertical:15}}>
        <View style={{padding:10,alignItems:'center'}}>
            <Avatar.Icon size={60} icon="folder" />
            <Text>Luis Gutiérrez</Text>
        </View>        
        
    </View>
)
}