import React,{Component} from 'react'
import {ScrollView,View} from 'react-native'
import {Text,Avatar} from 'react-native-paper'

export default (props)=>{
    return(
        <View>
            <Text>
            {props.text}
            </Text>
        </View>
    )
}