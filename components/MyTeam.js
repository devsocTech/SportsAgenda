import React,{Component} from 'react'
import {View} from 'react-native'
import {DataTable,Avatar} from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';
import Header from './Header';
import Tabs from './Tabs';
import Player from './Player';

 export default (props)=>{
     let rows=[];
     for (let i=0;i<20;i++){
         rows.push(Player)
     }


     return(
    <View style={{flex:1}}>

        <Header Title={props.Title} visible={props.visible} showDialog={props.showDialog} hideDialog={props.hideDialog} leagueSelect={props.leagueSelect} selectLeague={props.selectLeague}></Header>

        <View>
        <ScrollView>
            {rows}
        </ScrollView>
        </View>
        
    </View>
     )
 }