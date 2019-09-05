import React,{Component} from 'react';
import {Text,View} from 'react-native';
import Explore from '../components/Explore';



export default class ExploreScreen extends Component{

    constructor(props){
        super(props);

        this.state={
            visible: false,
            visible2: false,
            visible3: false,
            selectedTeam:'Guti Team',
            title:'Explora',
            leagueSelect:'Guti Team',
        }
    }

    showDialog = () => {
        this.setState({ visible: true })
    }

    hideDialog = () => {
        this.setState({ visible: false })
    }

    showDialog2 = () => {
        this.setState({ visible2: true })
    }

    hideDialog2 = () => {
        this.setState({ visible2: false })
    }

    showDialog3 = () => {
        this.setState({ visible3: true })
    }

    hideDialog3 = () => {
        this.setState({ visible3: false })
    }


    joinTeam=()=>{
        console.log("Aqui te unes a equipo")
    }

    joinLeague=()=>{
        console.log("Aqui te unes a liga")
    }

    selectTeam=(selectedTeam)=>{
        this.setState({selectedTeam:selectedTeam})
        console.log(this.state.selectedTeam)
    }

    selectLeague=(leagueSelect)=>{
        this.setState({leagueSelect:leagueSelect})
    }

    render(){

       

        return(
            <Explore 
                showDialog={this.showDialog}
                  hideDialog={this.hideDialog}
                  visible={this.state.visible}

                  showDialog2={this.showDialog2}
                  hideDialog2={this.hideDialog2}
                  visible2={this.state.visible2}

                  showDialog3={this.showDialog3}
                  hideDialog3={this.hideDialog3}
                  visible3={this.state.visible3}

                  selectedTeam={this.state.selectedTeam}
                  selectTeam={this.selectTeam}
                  Title={this.state.title}
                  
                  selectLeague={this.selectLeague}
                  leagueSelect={this.state.leagueSelect}>
            </Explore>
        );
    }
}