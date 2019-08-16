import React,{Component} from 'react';
import {Image,View} from 'react-native'

export default (props)=>{
    return(
    <View style={{height:100,width:170,marginLeft:20,marginRight:10}}>
        <View style={{flex:2}}>
            <Image source={require('./Assets/Pictures/footballone.jpg')}
                    style={{borderRadius:10,flex:1,width:null,height:null,resizeMode:'cover'}}/>
    </View>
    </View>
    )
}
