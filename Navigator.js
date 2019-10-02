import React,{Component} from 'react';
import {createAppContainer,createStackNavigator,createSwitchNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import TableScreen from './screens/TableScreen';
import GamesScreen from './screens/GamesScreen';
import MyTeamScreen from './screens/MyTeamScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import HomeAdminScreen from './screens/AdminHomeScreen';
import AdminGamesScreen from './screens/AdminGamesScreen';
import AdminTeamsScreen from './screens/AdminTeamsScreen';


const AuthNavigator = createStackNavigator({
    SignUp: SignUpScreen,
    SignIn: SignInScreen,
    Welcome: WelcomeScreen,
},{
    initialRouteName: 'Welcome'
})

const AppNavigator=createMaterialBottomTabNavigator({
    Tables: {screen: TableScreen,
        navigationOptions:{
            tabBarIcon:({tintColor})=>(
                <Icon name="table-large" color={tintColor} size={26}/>
                )
            }},
            Games: {screen: GamesScreen,
                navigationOptions:{
                    tabBarIcon:({tintColor})=>(
                        <Icon name="soccer" color={tintColor} size={26}/>
                        )
                    }},
            Home: {screen: HomeScreen,
                navigationOptions:{
                    tabBarIcon:({tintColor})=>(
                        <Icon name="home" color={tintColor} size={26}/>
                        )
                    }},
            Profile: {screen: ProfileScreen,
            navigationOptions:{
            tabBarIcon:({tintColor})=>(
                <Icon name="account" color={tintColor} size={26}/>
            )
            }},
},{
    initialRouteName: 'Home',
    labeled: false,
    inactiveColor: 'white',
    activeColor: '#47C9C6',
    barStyle: {backgroundColor:'#3B4B61',borderTopWidth:0.3}
});

const AdminNavigator=createMaterialBottomTabNavigator({
            Tables: {screen: TableScreen,
            navigationOptions:{
            tabBarIcon:({tintColor})=>(
                <Icon name="table-large" color={tintColor} size={26}/>
                )
            }},
            Games: {screen: AdminGamesScreen,
                navigationOptions:{
                    tabBarIcon:({tintColor})=>(
                        <Icon name="soccer" color={tintColor} size={26}/>
                        )
                    }},
            Home: {screen: HomeAdminScreen,
                navigationOptions:{
                    tabBarIcon:({tintColor})=>(
                        <Icon name="home" color={tintColor} size={26}/>
                        )
                    }},

            Teams: {screen: AdminTeamsScreen,
                navigationOptions:{
                    tabBarIcon:({tintColor})=>(
                        <Icon name="shield-half-full" color={tintColor} size={26}/>
                        )
                    }},
            
            Profile: {screen: ProfileScreen,
            navigationOptions:{
            tabBarIcon:({tintColor})=>(
                <Icon name="account" color={tintColor} size={26}/>
            )
            }},
},{
    initialRouteName: 'Home',
    labeled: false,
    inactiveColor: 'white',
    activeColor: '#47C9C6',
    barStyle: {backgroundColor:'#3B4B61',borderTopWidth:0.3}
});

export default createAppContainer(
    createSwitchNavigator({
        Auth: AuthNavigator,
        App: AppNavigator,
        Admin: AdminNavigator,
        AuthLoading: AuthLoadingScreen
    },{
        initialRouteName: 'AuthLoading'
    })
)