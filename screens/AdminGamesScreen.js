import React,{Component} from 'react';
import {View,Dimensions} from 'react-native';
import AdminGames from '../components/AdminGames';
import Header from '../components/Header'
import firebase from 'firebase'
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';



export default class AdminGamesScreen extends Component{

    constructor(props){
        super(props);

        this.state={
            visible: false,
            title:'Juegos',
            leagueSelect:'Guti Team',

            itemKeyId:'',
            itemGolesF:0,
            itemGolesV:0,
            itemNombreF:'',
            itemNombreV:'',

            contador:0,

            refreshing:false,
            loading:false,

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

    handleRefresh=()=>{
        this.llenarpartidosEquipo();
        this.llenarpartidosFinalizados();
        this.llenarpartidosProximos();
    }

    showDialog=(keyId,nombreEquipoF,nombreEquipoV,golesF,golesV)=>{
        this.setState({visible:true})
        this.setState({itemKeyId:keyId})
        this.setState({itemGolesF:golesF})
        this.setState({itemGolesV:golesV})
        this.setState({itemNombreF:nombreEquipoF})
        this.setState({itemNombreV:nombreEquipoV})
    }

    hideDialog=()=>{
        this.setState({visible:false})
    }

    llenarpartidosEquipo=()=>{
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        //aqui guardare el equipo del usuario
        var equipo = "h8zh3uZ9WtzFTTtcPscV"
        let matchArray=[];
        this.setState({ loading: true });
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).get().then((doc)=>{
            var infoEquipo = doc.data();
            var partidosEquipo = infoEquipo.Partidos;
            for(let i = 0; i<partidosEquipo.length;i++){
                db.collection("ligas").doc(liga).collection("partidos").doc(partidosEquipo[i]).get().then((doc)=>{
                    let datapartido = doc.data();
                    let keyId=doc.id
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
                    matchArray.push({keyId,equipoV,equipoF,nombreEquipoF,nombreEquipoV,stringDate,golesF,golesV,completado});
                    this.setState({matchTeam:matchArray,
                                   loading:false}, () => {
                    });
                })
            })
        })
        }
        })
    }

    llenarpartidosFinalizados=()=>{
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        let matchArray=[];
        db.collection("ligas").doc(liga).collection("partidos").where("completado", "==", true).orderBy("fechaPartido").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{

                let datapartido = doc.data();
                let keyId=doc.id
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
                matchArray.push({keyId,nombreEquipoF,nombreEquipoV,stringDate,golesF,golesV,completado});
                this.setState({matchFinish:matchArray}, () => {
                });
            })  
        })
    })
    })
    }

    llenarpartidosProximos=()=>{
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        let matchArray=[];
        db.collection("ligas").doc(liga).collection("partidos").where("completado", "==", false).orderBy("fechaPartido").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                let datapartido = doc.data();
                let keyId=doc.id
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

                matchArray.push({keyId,nombreEquipoF,nombreEquipoV,stringDate,golesF,golesV,completado});
                this.setState({matchNext:matchArray}, () => {
                })
                })
                });
                
            })
        })
    }

    registraPartido=(keyId,golesF,golesV)=>{
        var db = firebase.firestore();
        //aqui voy a guardar la selección del partido que hayan elegido en el dialog box (del input que ellos pongan)
        var selecciónPartido = keyId;
        //aqui voy a guardar los goles a favor del equipoF (del input que ellos pongan)
        var golesequipoFN = golesF;
        //aqui voy a guardar los goles a favor del equipoV (del input que ellos pongan)
        var golesequipoVN = golesV;
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        var ganadorO = "";
        var ganadorN = "";
        var difGF = 0;
        var difGV = 0;
        
        db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).get().then((doc)=>{
            var dataParti = doc.data();
            var compl = dataParti.completado
            var equipoF=dataParti.equipoF
            var equipoV=dataParti.equipoV
            
            if(compl == true){
                var golesequipoFO = dataParti.golesequipoF
                var golesequipoVO = dataParti.golesequipoV

                difGF = golesequipoFN - golesequipoFO
                difGV = golesequipoVN - golesequipoVO


                if(golesequipoFO>golesequipoVO){
                    ganadorO = "F"
                }
                else if(golesequipoFO<golesequipoVO){
                    ganadorO = "V"
                }
                else{
                    ganadorO = "E"
                }
                
                if(golesequipoFN>golesequipoVN){
                    ganadorN = "F"
                }
                else if(golesequipoFN<golesequipoVN){
                    ganadorN = "V"
                }
                else{
                    ganadorN = "E"
                }

                if(ganadorO == ganadorN){
                    db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
                        golesequipoF: golesequipoFN,
                        golesequipoV: golesequipoVN,  
                    })
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                        GolesContra: firebase.firestore.FieldValue.increment(difGV),
                        GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                    })
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                        GolesContra: firebase.firestore.FieldValue.increment(difGF),
                        GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                    })
                }
                else{
                    db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
                        golesequipoF: golesequipoFN,
                        golesequipoV: golesequipoVN,  
                    })
                    if(ganadorN == "F" && ganadorO == "V"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(-1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(-3),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        })
                    }
                    else if(ganadorN == "V" && ganadorO == "F"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(-1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        })
                    }
                    else if(ganadorN == "E" && ganadorO == "F"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(-1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(-2),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(-1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        })
                    }
                    else if(ganadorN == "E" && ganadorO == "V"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(-1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(-2),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(-1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        })
                    }
                    else if(ganadorN == "V" && ganadorO == "E"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(-1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(2),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        })
                    }
                    else if(ganadorN == "F" && ganadorO == "E"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(2),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(-1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        })
                    }
                }

            }
            else if(compl == false){
                db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
                    completado: true,
                    golesequipoF: golesequipoFN,
                    golesequipoV: golesequipoVN
                })
                db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).get().then(function(doc) {
                    var data = doc.data();
                    var equipoF = data.equipoF;
                    var equipoV = data.equipoV;
            
                    if(golesequipoFN>golesequipoVN){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                    }
                    else if(golesequipoVN>golesequipoFN){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                    }
                    else{
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                    }
                }) 
            }
            else{
                console.log("Hubo un error");
            }
        })
        this.hideDialog();
        this.handleRefresh();
    }
    
    changeF=(num)=>{
        this.setState({itemGolesF:num})
    }

    changeV=(num)=>{
        this.setState({itemGolesV:num})
    }
    
    

  

      _renderScene=({route})=>{
        switch (route.key){
            case 'first': return <AdminGames  changeV={this.changeV} changeF={this.changeF} itemNombreV={this.state.itemNombreV} itemNombreF={this.state.itemNombreF} itemGolesV={this.state.itemGolesV} itemGolesF={this.state.itemGolesF} itemKeyId={this.state.itemKeyId} registraPartido={this.registraPartido} loading={this.state.loading} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh} visible={this.state.visible} hideDialog={this.hideDialog} showDialog={this.showDialog} team={this.state.matchNext}/>
            case 'second': return <AdminGames changeV={this.changeV} changeF={this.changeF} itemNombreV={this.state.itemNombreV} itemNombreF={this.state.itemNombreF} itemGolesV={this.state.itemGolesV} itemGolesF={this.state.itemGolesF} itemKeyId={this.state.itemKeyId} registraPartido={this.registraPartido} loading={this.state.loading} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh}  visible={this.state.visible} hideDialog={this.hideDialog} showDialog={this.showDialog} team={this.state.matchFinish}/>
            case 'third': return <AdminGames  changeV={this.changeV} changeF={this.changeF} itemNombreV={this.state.itemNombreV} itemNombreF={this.state.itemNombreF} itemGolesV={this.state.itemGolesV} itemGolesF={this.state.itemGolesF} itemKeyId={this.state.itemKeyId} registraPartido={this.registraPartido} loading={this.state.loading} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh} visible={this.state.visible} hideDialog={this.hideDialog} showDialog={this.showDialog} team={this.state.matchTeam}/>
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