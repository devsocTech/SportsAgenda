import React,{Component} from 'react';
import {Text,View,Dimensions,StatusBar} from 'react-native';

import Games from '../components/Games'
import firebase from 'firebase'
import Header from '../components/Header';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';

export default class GamesScreen extends Component{

    constructor(props){
        super(props);

        this.state={
            visible: false,
            title:'Juegos',
            leagueSelect:'Guti Team',

            matchTeam:[],
            matchNext:[],
            matchFinish:[],

            index: 0,
            routes: [
            { key: 'first', title: 'Próximos' },
            { key: 'second', title: 'Finalizados' },
            { key: 'third', title: 'Mi equipo'},
            ],
        }
        }

    componentDidMount=()=>{
        this.llenarpartidosEquipo();
        this.llenarpartidosFinalizados();
        this.llenarpartidosProximos();
    }


    llenarpartidosEquipo=()=>{
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        //aqui guardare el equipo del usuario
        var equipo = "h8zh3uZ9WtzFTTtcPscV"
        let matchArray=[];
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).get().then((doc)=>{
            var infoEquipo = doc.data();
            var partidosEquipo = infoEquipo.Partidos;
            for(let i = 0; i<partidosEquipo.length;i++){
                db.collection("ligas").doc(liga).collection("partidos").doc(partidosEquipo[i]).get().then((doc)=>{
                    let datapartido = doc.data();
                    let equipoF=datapartido.equipoF
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).get().then((doc)=>{
                        var dataEquipo = doc.data();
                        var nombreEquipoF = dataEquipo.Nombre;
                    let equipoV=datapartido.equipoV
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).get().then((doc)=>{
                        var dataEquipo = doc.data();
                        var nombreEquipoV = dataEquipo.Nombre;
                    let fecha=datapartido.fechaPartido
                    let golesF=datapartido.golesequipoF
                    let golesV=datapartido.golesequipoV
                    let completado=datapartido.completado
                    
                    var date=new Date(fecha.seconds*1000)
                    var dia=date.getDate()
                    var mes=date.getMonth()+1
                    var año=date.getFullYear()

                    var hora=date.getHours()
                    var minutos=date.getMinutes()

                    var stringDate= (dia+"/"+mes+"/"+año+" "+hora+":"+minutos)
                    console.log(stringDate)
                    matchArray.push({nombreEquipoF,nombreEquipoV,stringDate,golesF,golesV,completado});
                    this.setState({matchTeam:matchArray}, () => {
                    });
                })
            })
        })
        }
        })
    }

    llenarpartidosFinalizados(){
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        let matchArray=[];
        db.collection("ligas").doc(liga).collection("partidos").where("completado", "==", true).orderBy("fechaPartido").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{

                let datapartido = doc.data();
                let equipoF=datapartido.equipoF
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).get().then((doc)=>{
                    var dataEquipo = doc.data();
                    var nombreEquipoF = dataEquipo.Nombre;
                let equipoV=datapartido.equipoV
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).get().then((doc)=>{
                    var dataEquipo = doc.data();
                    var nombreEquipoV = dataEquipo.Nombre;
                let fecha=datapartido.fechaPartido
                let golesF=datapartido.golesequipoF
                let golesV=datapartido.golesequipoV
                let completado=datapartido.completado

                var date=new Date(fecha.seconds*1000)
                    var dia=date.getDate()
                    var mes=date.getMonth()+1
                    var año=date.getFullYear()

                    var hora=date.getHours()
                    var minutos=date.getMinutes()

                    var stringDate= (dia+"/"+mes+"/"+año+" "+hora+":"+minutos)
                matchArray.push({nombreEquipoF,nombreEquipoV,stringDate,golesF,golesV,completado});
                this.setState({matchFinish:matchArray}, () => {
                });
            })  
        })
    })
    })
    }

    llenarpartidosProximos(){
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        let matchArray=[];
        db.collection("ligas").doc(liga).collection("partidos").where("completado", "==", false).orderBy("fechaPartido").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                let datapartido = doc.data();
                let equipoF=datapartido.equipoF
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).get().then((doc)=>{
                    var dataEquipo = doc.data();
                    var nombreEquipoF = dataEquipo.Nombre;
                
                let equipoV=datapartido.equipoV
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).get().then((doc)=>{
                    var dataEquipo = doc.data();
                    var nombreEquipoV = dataEquipo.Nombre;
                let fecha=datapartido.fechaPartido
                let golesF=datapartido.golesequipoF
                let golesV=datapartido.golesequipoV
                let completado=datapartido.completado

                var date=new Date(fecha.seconds*1000)
                    var dia=date.getDate()
                    var mes=date.getMonth()+1
                    var año=date.getFullYear()

                    var hora=date.getHours()
                    var minutos=date.getMinutes()

                    var stringDate= (dia+"/"+mes+"/"+año+" "+hora+":"+minutos)

                matchArray.push({nombreEquipoF,nombreEquipoV,stringDate,golesF,golesV,completado});
                console.log(matchArray)
                this.setState({matchNext:matchArray}, () => {
                })
                })
                });
                
            })
        })
    }

    FirstRoute= () =>{
        return(
        <Games team={this.state.matchNext}/>
        )
      }
      
      SecondRoute = () => {
        return(
            <Games team={this.state.matchNext}/>
        )
      }
      
      ThirdRoute=()=>{
        return(
        <Games team={this.state.matchTeam}></Games>
        )
      }

      _renderScene=({route})=>{
        switch (route.key){
            case 'first': return <Games team={this.state.matchNext}/>
            case 'second': return <Games team={this.state.matchFinish}/>
            case 'third': return <Games team={this.state.matchTeam}></Games>
        }
    }
    


    render(){
        return(
            <View style={{flex:1}}>
              <Header tit={this.state.title}></Header>
              <TabView
                navigationState={this.state}
                renderScene={this._renderScene}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props=><TabBar {...props} indicatorStyle={{ backgroundColor: '#47C9C6' }}
                labelStyle={{color:'#47C9C6',fontWeight:'bold'}}
                style={{ paddingTop:10,backgroundColor: '#FAFAFA' }}></TabBar>}
              />
            </View>
        );
    }
}