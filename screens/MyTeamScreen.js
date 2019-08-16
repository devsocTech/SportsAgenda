import React,{Component} from 'react';
import {Text,View} from 'react-native';
import MyTeam from '../components/MyTeam';

export default class Tablecreen extends Component{
    constructor(props){
        super(props);

        this.state={
            title:'Mi Equipo',
            Nombre: '',
            Puntos:0,
            PJ:0,
            PG:0,
            PE:0,
            PP:0,
            GC:0,
            GF:0,
            DG:0,
            visible: false,
            leagueSelect:'Guti Team'
        }
    }

    showDialog = () => {
        this.setState({ visible: true })
    }

    hideDialog = () => {
        this.setState({ visible: false })
    }

    selectLeague=(leagueSelect)=>{
        this.setState({leagueSelect:leagueSelect})
    }

    render(){
        return(
            <MyTeam Nombre={this.state.Nombre}
            Puntos={this.state.Puntos}
            PJ={this.state.PJ}
            PG={this.state.PG}
            PE={this.state.PE}
            PP={this.state.PP}
            DG={this.state.DG}
            Title={this.state.title}
            showDialog={this.showDialog}
            hideDialog={this.hideDialog}
            visible={this.state.visible}

            selectLeague={this.selectLeague}
            leagueSelect={this.state.leagueSelect}/>
        );
    }
}