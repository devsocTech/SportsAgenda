import React,{Component} from 'react'
import {ScrollView,View} from 'react-native'
import {Card} from 'react-native-paper'

import Match from './Match'
import Header from './Header';

export default (props)=>{

    let rows=[];
    for (let i=0;i<10;i++){
        rows.push(<Match></Match>)
    }

    return(
    <View style={{flex:1}}>

        <View>
        <ScrollView>
            {rows}
        </ScrollView>
        </View>
        
    </View>
    )
}