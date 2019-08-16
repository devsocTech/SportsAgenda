import React,{Component} from 'react';
import {View} from 'react-native';
import {DefaultTheme, Button,Appbar, Card, Text,Avatar} from 'react-native-paper';
import firebase from 'firebase';
import Header from './Header'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default (props)=>{
    return(
        <View style={{flex:1}}>
            <Header nleagueSelect={props.nleagueSelect} ligas={props.ligas} nLigas={props.nLigas} Title={props.title} visible={props.visible} showDialog={props.showDialog} hideDialog={props.hideDialog} leagueSelect={props.leagueSelect} selectLeague={props.selectLeague}></Header>
            
            <View style={{paddingTop:25}}>

                <View style={{justifyContent:"space-around",flexDirection:'row',paddingVertical:5,zIndex:1}}>
                    <Card theme={theme} style={{alignItems:'flex-start',height:100,width:160,marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:15}}>EQUIPO:</Text>
                            <Text style={{fontSize:20,fontWeight:'bold'}}>{props.teamName}</Text>
                        </Card.Content>
                    </Card>

                    <Card theme={theme} style={{alignItems:'flex-end',height:100,width:160,marginLeft:20,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:15}}>POSICIÓN:</Text>
                            <Text style={{fontSize:35,fontWeight:'bold',alignSelf:'flex-end'}}>{props.teamPos}</Text>
                        </Card.Content>
                    </Card>


                </View>

                <View style={{justifyContent:"space-around",zIndex:2,flexDirection:'row',paddingVertical:5}}>

                    <Card theme={theme} style={{alignItems:'flex-start',height:100,width:160,marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:35,fontWeight:'bold'}}>{props.golesF}</Text>
                            <Text style={{fontSize:17}}>GOLES(+)</Text>
                        </Card.Content>
                    </Card>
                    

                    <Card theme={theme} style={{alignItems:'flex-end',height:100,width:160,marginLeft:10,marginRight:10}}>
                        <Card.Content>
                            <Text style={{fontSize:35,fontWeight:'bold',alignSelf:'flex-end'}}>{props.golesC}</Text>
                            <Text style={{fontSize:17}}>GOLES(-)</Text>
                        </Card.Content>
                    </Card>

                </View>

                <View style={{zIndex:3,marginTop:30,position:'absolute',height:210,width:370,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
                    <Icon style={{position:'absolute'}} name="shield" color='white' size={160}/>
                    <Icon name="security" color='#47C9C6' size={130}/>
                </View>

        </View>
            <Button onPress={() => firebase.auth().signOut()}> Cerrar Sesión </Button>
            <Button onPress={() => props.agregarLiga()}> Agregar liga (y generar sus codigos) </Button>
            <Button onPress={() => props.unirteLiga()}> Unirte a liga con codigo </Button>
            <Button onPress={() => props.crearEquipo()}> Crea tu equipo </Button>
            <Button onPress={() => props.agregarJugador()}> Agrega un Jugador a un equipo </Button>
            <Button onPress={() => props.unirteEquipo()}> Unete a un equipo </Button>
            <Button onPress={() => props.programaPartido()}> Programa un partido </Button>
            <Button onPress={() => props.registraPartido()}> Registra el marcador de un partido </Button>
        </View>
    );
}

const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: '#47C9C6',
      accent: '#47C9C6',
      background: '#3B4B61',
      text:'white',
      placeholder: '#FAFAFA',
      surface: '#3B4B61',
      disabled: 'white'
    }
  };