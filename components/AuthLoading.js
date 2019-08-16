import React,{Component} from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

export default (props)=>{
    return(
    <View style={{justifyContent:'center',flex:1}}>
        <ActivityIndicator animating={true} size={75} color='#47C9C6'></ActivityIndicator>
    </View>
    );
}
