import React,{Component} from 'react'
import {View,RefreshControl} from 'react-native'
import {DataTable,DefaultTheme} from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';

 export default (props)=>{


     return(
      <View style={{flex:1}}>

      <ScrollView
      refreshControl={
        <RefreshControl refreshing={props.refreshing} onRefresh={props.handleRefresh}/>}>
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

        <ScrollView>
        {props.rows}
        </ScrollView>

  
      </DataTable>


      </ScrollView>
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