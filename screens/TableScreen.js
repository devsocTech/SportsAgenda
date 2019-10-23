import React,{Component} from 'react';
import {Text,View} from 'react-native';
import firebase from 'firebase';
import {DataTable,Avatar,DefaultTheme} from 'react-native-paper'
import Table from '../components/Table'
import Header from '../components/Header'
import SnackBars from '../components/SnackBars';

export default class Tablecreen extends Component{
    constructor(props){

        super(props);

        this.state={
            team:[],
            title:'Tablas',

            leagueSelect:'',
            nleagueSelect:'',
            keyTeam:0,

            ligas:[],
            nLigas:[],
            ligasMaster:[],
            equipo:'',
            equipos:[],
            rows:[],
            visibleSnackBar: false,
            mensajeSnackBar: '',
            refreshing:false,
        }
    }
    

    componentDidMount=()=>{
        this.obtenerLigas();
    }

    dismissSnackbar=()=>{
      this.setState({
          visibleSnackBar:false
      })
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

    handleRefresh=()=>{
      this.setState({refreshing:true})
      this.setState({rows:[]})
      if(this.state.leagueSelect!=""){
        this.llenarTabla(()=>{})
      }
      this.setState({refreshing:false})
      
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
              ligasMaster.push({value:ligas[i],label:nombreLiga[i],color:'black',key:i})
              this.setState({ligasMaster:ligasMaster},()=>{})
              this.setState({equipos:equipos},()=>{})
              //this.setState({leagueSelect:ligas[0]},()=>{})
              //this.setState({nleagueSelect:nombreLiga[0]},()=>{})
              //this.setState({equipo:equipos[0]},()=>{})
          }).catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al cargar tus ligas"})
            this.setState({visibleSnackBar: true});
        });
      }}).catch((error)=> {
        this.setState({mensajeSnackBar: "Hubo un error al cargar tus ligas"})
        this.setState({visibleSnackBar: true});
    });
    }

    llenarTabla=()=>{
        var db = firebase.firestore();
        var liga = this.state.leagueSelect;
        var contador = 1;
        var arreglo = [];
        db.collection("ligas").doc(liga).collection("equipos").orderBy("Puntos", "desc").get().then(querySnapshot => {
          querySnapshot.forEach((doc)=> {
            var dataEquipo = doc.data();
            var nombreEquipo = dataEquipo.Nombre;
            var PTS =dataEquipo.Puntos;
            var J = dataEquipo.PartidosJugados;
            var G = dataEquipo.PartidosGanados;
            var P = dataEquipo.PartidosPerdidos;
            var E = dataEquipo.PartidosEmpatados;
            var DG = (dataEquipo.GolesFavor) - (dataEquipo.GolesContra);
            db.collection("ligas").doc(liga).collection("equipos").doc(doc.id).update({
              Posición: contador
            })
            arreglo.push({nombreEquipo, PTS, J, G, P, E, DG});
            contador++; 
            this.setState({team:arreglo }, () => {

              var array = this.state.team;
              var rows=[];
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
              this.setState({rows:rows},()=>{console.log(this.state.rows)})
            });
          })
        })
        .catch((error)=> {
          this.setState({mensajeSnackBar: "Hubo un error al cargar la tabla de posiciones"})
          this.setState({visibleSnackBar: true});
      });
    }

    showDialog = () => {
        this.setState({ visible: true })
    }

    hideDialog = () => {
        this.setState({ visible: false })
    }
    
    render(){
        return(
          <View style={{flex:1}}>
              <Header ligasMaster={this.state.ligasMaster} leagueSelect={this.state.leagueSelect} nleagueSelect={this.state.nleagueSelect} selectLeagues={this.selectLeagues} tit={this.state.title}></Header>
            <Table 
            team={this.state.team}

            rows={this.state.rows}

            Title={this.state.title}
            showDialog={this.showDialog}
            hideDialog={this.hideDialog}
            visible={this.state.visible}

            selectLeague={this.selectLeague}
            leagueSelect={this.state.leagueSelect}
            refreshing={this.state.refreshing}
            handleRefresh={this.handleRefresh}/>
            
            <SnackBars
               mensajeSnackBar= {this.state.mensajeSnackBar}
               visibleSnackBar={this.state.visibleSnackBar}
               dismissSnackbar = {this.dismissSnackbar}
            ></SnackBars>

          </View>
            
        );
    }
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