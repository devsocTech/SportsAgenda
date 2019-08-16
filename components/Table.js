import React,{Component} from 'react'
import {View} from 'react-native'
import {DataTable,Avatar,DefaultTheme} from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';
import Header from './Header';
import Tabs from './Tabs';

 export default (props)=>{
     let rows=[];
     let array = props.team;
     for (let i=0;i<array.length;i++){
         rows.push(
         <DataTable.Row theme={theme}>
            <DataTable.Cell style={{flex:6}}>{array[i].nombreEquipo}</DataTable.Cell>
            <DataTable.Cell style={{flex:1}}numeric>{array[i].PTS}</DataTable.Cell>
            <DataTable.Cell style={{flex:1}}numeric>{array[i].J}</DataTable.Cell>
            <DataTable.Cell style={{flex:1}}numeric>{array[i].G}</DataTable.Cell>
            <DataTable.Cell style={{flex:1}}numeric>{array[i].P}</DataTable.Cell>
            <DataTable.Cell style={{flex:1}}numeric>{array[i].E}</DataTable.Cell>
            <DataTable.Cell style={{flex:1}}numeric>{array[i].DG}</DataTable.Cell>
        </DataTable.Row>)
     }


     return(
      <View style={{flex:1}}>

      <Header Title={props.Title} visible={props.visible} showDialog={props.showDialog} hideDialog={props.hideDialog} leagueSelect={props.leagueSelect} selectLeague={props.selectLeague}></Header>
        

      <DataTable style={{paddingTop:20,flex:1}}>
        <DataTable.Header theme={theme}>
          <DataTable.Title style={{flex:6}}>Equipo</DataTable.Title>
          <DataTable.Title style={{flex:1}} numeric>P</DataTable.Title>
          <DataTable.Title style={{flex:1}} numeric>PJ</DataTable.Title>
          <DataTable.Title style={{flex:1}} numeric>PG</DataTable.Title>
          <DataTable.Title style={{flex:1}} numeric>PP</DataTable.Title>
          <DataTable.Title style={{flex:1}} numeric>PE</DataTable.Title>
          <DataTable.Title style={{flex:1}} numeric>DG</DataTable.Title>
        </DataTable.Header>

        <ScrollView>{rows}</ScrollView>

  
      </DataTable>


      </View>
     )
 }

 const theme = {
  ...DefaultTheme,
  roundness: 100,
  colors: {
    ...DefaultTheme.colors,
    primary: '#47C9C6',
    accent: 'red',
    background: 'transparent',
    text:'#1E1E1E',
    placeholder: 'white',
    surface: '#EEEEEE',
    disabled: 'white'
  }
};