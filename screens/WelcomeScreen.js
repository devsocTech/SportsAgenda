import React, {Component} from 'react';

import Welcome from '../components/Welcome';

export default class WelcomeScreen extends Component{
    constructor(props){
        super(props);
        
        this.state={

        }
    }

    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: 'white'
    }

    render(){
        return(
            <Welcome
                navigationAction1={()=>{this.props.navigation.navigate('SignUp')}}
                navigationAction2={()=>{this.props.navigation.navigate('SignIn')}}>
            </Welcome>
        )
    }
}

