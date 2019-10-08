import React,{Component} from 'react';
import {View,Dimensions} from 'react-native';
import AdminGames from '../components/AdminGames';
import Header from '../components/Header'
import firebase from 'firebase'
import { TabView, TabBar } from 'react-native-tab-view';
import SnackBars from '../components/SnackBars';



export default class AdminGamesScreen extends Component{

    constructor(props){
        super(props);

        this.state={
            visible: false,
            title:'Juegos',

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

            leagueSelect:'',
            nleagueSelect:'',
            keyTeam:0,

            ligas:[],
            nLigas:[],
            ligasMaster:[],
            equipo:'',
            equipos:[],

            visibleSnackBar: false,
            mensajeSnackBar: '',

            index: 0,
            routes: [
            { key: 'first', title: 'Próximos' },
            { key: 'second', title: 'Finalizados' },
            ],
        }
        }

    componentDidMount=()=>{
        this.obtenerLigas()
    }

    selectLeagues=(value,key)=>{
        try {
        this.setState({leagueSelect:value},()=>{})
        var equipo=this.state.equipos[key]
        this.setState({equipo:equipo},()=>{this.handleRefresh()})
            
        } catch (error) {
            this.setState({mensajeSnackBar: "Tu liga todavía no tiene equipos"})
            this.setState({visibleSnackBar: true});
        }    
    }

    obtenerLigas=()=>{
        var user = firebase.auth().currentUser;
        var db=firebase.firestore();
        var ligas=[];
        var ligasMaster=[];
        var nombreLiga=[];
        var equipos=[];
        db.collection("usuarios").doc(user.uid).get().then((doc)=>{
            var data = doc.data();
            ligas = data.ligas;
            equipos=data.Equipos;
            for(let i=0;i<ligas.length;i++){
            db.collection("ligas").doc(ligas[i]).get().then((doc)=>{
                var data=doc.data();
                nombreLiga.push(data.Nombre)
                //console.log(nombreLiga)
                //console.log(this.state.nleagueSelect)
                ligasMaster.push({value:ligas[i],label:nombreLiga[i],color:'black',key:i})
                this.setState({ligasMaster:ligasMaster},()=>{})
                this.setState({equipos:equipos},()=>{})
                this.setState({leagueSelect:ligas[0]},()=>{})
                this.setState({nleagueSelect:nombreLiga[0]},()=>{})
                this.setState({equipo:equipos[0]},()=>{})
            })
            .catch((error)=> {
                this.setState({mensajeSnackBar: "Hubo un error al cargar tus ligas"})
                this.setState({visibleSnackBar: true});
            });
        }
    })
        .catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al cargar tus ligas"})
            this.setState({visibleSnackBar: true});
        });
    }

    handleRefresh=()=>{
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

    llenarpartidosFinalizados=()=>{
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = this.state.leagueSelect
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
            .catch((error)=> {
                this.setState({mensajeSnackBar: "Hubo un error al cargar tus partidos"})
                this.setState({visibleSnackBar: true});
            });  
        })
        .catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al cargar tus partidos"})
            this.setState({visibleSnackBar: true});
        });
    })
    })
    }

    llenarpartidosProximos=()=>{
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = this.state.leagueSelect
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
                .catch((error)=> {
                    this.setState({mensajeSnackBar: "Hubo un error al cargar tus partidos"})
                    this.setState({visibleSnackBar: true});
                });

                })
                .catch((error)=> {
                    this.setState({mensajeSnackBar: "Hubo un error al cargar tus partidos"})
                    this.setState({visibleSnackBar: true});
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
        var liga = this.state.leagueSelect;
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
                    }).then(()=> {
                        var success = "Se registró tu partido"
                        this.setState({mensajeSnackBar: success})
                        this.setState({visibleSnackBar: true});
                    })
                    .catch((error)=> {
                        this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                        this.setState({visibleSnackBar: true});
                    });
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                        GolesContra: firebase.firestore.FieldValue.increment(difGV),
                        GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                    }).then(()=> {
                        var success = "Se registró tu partido"
                        this.setState({mensajeSnackBar: success})
                        this.setState({visibleSnackBar: true});
                    })
                    .catch((error)=> {
                        this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                        this.setState({visibleSnackBar: true});
                    });
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                        GolesContra: firebase.firestore.FieldValue.increment(difGF),
                        GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                    }).then(()=> {
                        var success = "Se registró tu partido"
                        this.setState({mensajeSnackBar: success})
                        this.setState({visibleSnackBar: true});
                    })
                    .catch((error)=> {
                        this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                        this.setState({visibleSnackBar: true});
                    });
                }
                else{
                    db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
                        golesequipoF: golesequipoFN,
                        golesequipoV: golesequipoVN,  
                    }).then(()=> {
                        var success = "Se registró tu partido"
                        this.setState({mensajeSnackBar: success})
                        this.setState({visibleSnackBar: true});
                    })
                    .catch((error)=> {
                        this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                        this.setState({visibleSnackBar: true});
                    });
                    if(ganadorN == "F" && ganadorO == "V"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(-1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(-3),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                    else if(ganadorN == "V" && ganadorO == "F"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(-1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                    else if(ganadorN == "E" && ganadorO == "F"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(-1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(-2),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(-1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                    else if(ganadorN == "E" && ganadorO == "V"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(-1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(-2),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(-1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                    else if(ganadorN == "V" && ganadorO == "E"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(-1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(2),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                    else if(ganadorN == "F" && ganadorO == "E"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(2),
                            GolesContra: firebase.firestore.FieldValue.increment(difGV),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGF),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(-1),
                            Puntos: firebase.firestore.FieldValue.increment(-1),
                            GolesContra: firebase.firestore.FieldValue.increment(difGF),
                            GolesFavor: firebase.firestore.FieldValue.increment(difGV),
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                }

            }
            else if(compl == false){
                db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
                    completado: true,
                    golesequipoF: golesequipoFN,
                    golesequipoV: golesequipoVN
                }).then(()=> {
                    var success = "Se registró tu partido"
                    this.setState({mensajeSnackBar: success})
                    this.setState({visibleSnackBar: true});
                })
                .catch((error)=> {
                    this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                    this.setState({visibleSnackBar: true});
                });
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
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                    else if(golesequipoVN>golesequipoFN){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                    else{
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        }).then(()=> {
                            var success = "Se registró tu partido"
                            this.setState({mensajeSnackBar: success})
                            this.setState({visibleSnackBar: true});
                        })
                        .catch((error)=> {
                            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
                            this.setState({visibleSnackBar: true});
                        });
                    }
                })
            }
        }).then(()=> {
            var success = "Se registró tu partido"
            this.setState({mensajeSnackBar: success})
            this.setState({visibleSnackBar: true});
        })
        .catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al registrar el marcador"})
            this.setState({visibleSnackBar: true});
        });

        this.hideDialog();
        this.handleRefresh();
    }

    cancelarPartido=(keyId)=>{
        var db = firebase.firestore();
        var selecciónPartido = keyId;
        var liga = this.state.leagueSelect;
        db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).delete()
        .then(()=> {
            var success = "Se canceló el partido"
            this.setState({mensajeSnackBar: success})
            this.setState({visibleSnackBar: true});
        }).catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al cancelar el partido"})
            this.setState({visibleSnackBar: true});
        });
        this.hideDialog();
        this.handleRefresh();
    }

    changeF=(num)=>{
        this.setState({itemGolesF:num})
    }

    changeV=(num)=>{
        this.setState({itemGolesV:num})
    }

    dismissSnackbar=()=>{
        this.setState({
            visibleSnackBar:false
        })
    }
    
    _renderScene=({route})=>{
        switch (route.key){
            case 'first': return <AdminGames cancelarPartido={this.cancelarPartido} changeV={this.changeV} changeF={this.changeF} itemNombreV={this.state.itemNombreV} itemNombreF={this.state.itemNombreF} itemGolesV={this.state.itemGolesV} itemGolesF={this.state.itemGolesF} itemKeyId={this.state.itemKeyId} registraPartido={this.registraPartido} loading={this.state.loading} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh} visible={this.state.visible} hideDialog={this.hideDialog} showDialog={this.showDialog} team={this.state.matchNext} />
            case 'second': return <AdminGames cancelarPartido={this.cancelarPartido} changeV={this.changeV} changeF={this.changeF} itemNombreV={this.state.itemNombreV} itemNombreF={this.state.itemNombreF} itemGolesV={this.state.itemGolesV} itemGolesF={this.state.itemGolesF} itemKeyId={this.state.itemKeyId} registraPartido={this.registraPartido} loading={this.state.loading} refreshing={this.state.refreshing} handleRefresh={this.handleRefresh}  visible={this.state.visible} hideDialog={this.hideDialog} showDialog={this.showDialog} team={this.state.matchFinish}/>
        }
    }
    
    render(){
        return(
            <View style={{flex:1}}>
              <Header ligasMaster={this.state.ligasMaster} leagueSelect={this.state.leagueSelect} nleagueSelect={this.state.nleagueSelect} selectLeagues={this.selectLeagues} tit={this.state.title}></Header>              
              <TabView
                navigationState={this.state}
                renderScene={this._renderScene}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props=><TabBar {...props} indicatorStyle={{ backgroundColor: '#47C9C6' }}
                labelStyle={{color:'#47C9C6',fontWeight:'bold'}}
                style={{ paddingTop:10,backgroundColor: '#FAFAFA' }}></TabBar>}
              />
            <SnackBars
                mensajeSnackBar= {this.state.mensajeSnackBar}
                visibleSnackBar={this.state.visibleSnackBar}
                dismissSnackbar = {this.dismissSnackbar}
            ></SnackBars>

            </View>
        );
    }
}