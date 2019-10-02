import React,{Component} from 'react'
import {View,FlatList,TouchableOpacity} from 'react-native';
import {DefaultTheme, Button,Appbar,Text,Avatar,ActivityIndicator,Portal,Dialog} from 'react-native-paper';

export default (props)=>{
    return(
        <View style={{flexDirection:'row',justifyContent:'space-evenly',flex:1}}>
            <FlatList
            data={props.equipos}
            renderItem={({item})=>(
                <View>
                    <TouchableOpacity>
                        <View style={{flex:1,padding:10,alignItems:'center'}}>
                            <Avatar.Icon color="white" size={60} icon="security"/>
                            <Text>{item.NombreEquipo}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
            onRefresh={props.handleRefresh}
            refreshing={props.refreshing}>
            </FlatList>
        </View>
    )
}