import React,{Component} from 'react';
import {Text,View} from 'react-native';

import Games from '../components/Games'
import Tabs from '../components/Tabs'

export default class GamesScreen extends Component{
    constructor(props){
        super(props);

        this.state={
            visible: false,
            title:'Juegos',
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
            <Tabs 
            Title={this.state.title}

            showDialog={this.showDialog}
            hideDialog={this.hideDialog}
            visible={this.state.visible}

            selectLeague={this.selectLeague}
            leagueSelect={this.state.leagueSelect}
            ></Tabs>
        );
    }
}