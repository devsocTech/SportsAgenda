import React,{Component} from 'react';
import {Text,View} from 'react-native';
import Profile from '../components/Profile';
import firebase from 'firebase'

export default class ProfileScreen extends Component{
    constructor(props){
        this.state={
            
        }
    }

    render(){
        return(
            <Profile/>
        );
    }}