import React,{Component} from 'react'
import {View} from 'react-native'
import Header from '../components/Header'
import AdminTeams from '../components/AdminTeams'
import firebase from 'firebase'
import SnackBars from '../components/SnackBars';

export default class AdminTeamsScreen extends Component{

    constructor(props){

        super(props);

        this.state={
            visible:false,
            title:'Equipos',

            equipos:[],
            refreshing:false,

            leagueSelect:'',
            nleagueSelect:'',
            keyTeam:0,

            mensajeSnackBar: '',
            visibleSnackBar: false,

            ligas:[],
            nLigas:[],
            ligasMaster:[],
            equipo:'',

            equiposMaster:[],

            
            pago:0,
            keyId:'',
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
            //this.setState({leagueSelect:ligas[0]},()=>{})
            //this.setState({nleagueSelect:nombreLiga[0]},()=>{})
            //this.setState({equipo:equipos[0]},()=>{})
        })
        .catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al obtener tus ligas"})
            this.setState({visibleSnackBar: true});
        });
    }})
    .catch((error)=> {
        this.setState({mensajeSnackBar: "Hubo un error al obtener tus ligas"})
        this.setState({visibleSnackBar: true});
    });
}

handleRefresh=()=>{
    this.setState({refreshing:true})
    this.setState({equiposMaster:[]})
    if(this.state.leagueSelect!=""){
        this.obtenerEquipos()
    }
    this.setState({refreshing:false})
}



obtenerEquipos=()=>{
    var db=firebase.firestore()
    var user =firebase.auth().currentUser
    var arrayEquipos=[];
    
        ligas=this.state.leagueSelect
            db.collection("ligas").doc(ligas).collection("equipos").get().then(querySnapshot=>{
                querySnapshot.forEach((doc)=>{
                var data=doc.data()
                var idDoc=doc.id
                var nombreEquipo=data.Nombre
                var Pagos=data.Pagos
                var codigoEquipos = data.Codigo;
                
                arrayEquipos.push({idDoc,nombreEquipo,Pagos,codigoEquipos})
                this.setState({equiposMaster:arrayEquipos},()=>{console.log(arrayEquipos)})
            })
            }).catch((error)=> {
                this.setState({mensajeSnackBar: "Hubo un error al cargar los equipos"})
                this.setState({visibleSnackBar: true});
            });
}

dismissSnackbar=()=>{
    this.setState({
        visibleSnackBar:false
    })
}

visiblePago=(keyId)=>{
    this.setState({visible:true})
    this.setState({keyId:keyId})
}

hideDialogPago=()=>{
    this.setState({visible:false})
}

changePago=(value)=>{
    this.setState({pago:value})
}

registraPago=(equipo,pago)=>{
    var db=firebase.firestore();
    var user =firebase.auth().currentUser;
    var liga=this.state.leagueSelect
    db.collection("ligas").doc(liga).collection("equipos").doc(equipo).update({
        Pagos: firebase.firestore.FieldValue.increment(-pago),
    }).then(()=> {
        db.collection("ligas").doc(liga).update({
            CobranzaPendiente: firebase.firestore.FieldValue.increment(-pago)
        })
    })
    .then(()=> {
        var success = "Se registró el pago"
        this.setState({mensajeSnackBar: success})
        this.setState({visibleSnackBar: true},()=>{this.handleRefresh();});
    })
    .catch((error)=> {
        this.setState({mensajeSnackBar: "Hubo un error al registrar el pago"})
        this.setState({visibleSnackBar: true});
    });

    this.setState({pago: 0})
    this.hideDialogPago();
}

render(){
    return(
        <View style={{flex:1}}>
            <Header ligasMaster={this.state.ligasMaster} leagueSelect={this.state.leagueSelect} nleagueSelect={this.state.nleagueSelect} selectLeagues={this.selectLeagues} tit={this.state.title}></Header>
            <AdminTeams
            equipos={this.state.equiposMaster}
            handleRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            hideDialog={this.hideDialogPago}
            showDialog={this.visiblePago}
            visible={this.state.visible}
            changePago={this.changePago}
            registraPago={this.registraPago}

            pago={this.state.pago}
            keyId={this.state.keyId}
            >
            </AdminTeams>

            <SnackBars
                  mensajeSnackBar= {this.state.mensajeSnackBar}
                  visibleSnackBar={this.state.visibleSnackBar}
                  dismissSnackbar = {this.dismissSnackbar}
            > </SnackBars>
        </View>

        );
    }
}