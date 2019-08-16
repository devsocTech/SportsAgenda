import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import Header from './Header';
import Games from './Games';

const FirstRoute = () => (
  <Games/>
);
const SecondRoute = () => (
  <Games/>
);

const ThirdRoute=()=>(
  <Games/>
);

export default class Tabs extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Próximos' },
      { key: 'second', title: 'Finalizados' },
      { key: 'third', title: 'Mi equipo'}
    ],
  };

  render() {
    return (
    <View style={{flex:1}}>
      <Header Title={this.props.Title} visible={this.props.visible} showDialog={this.props.showDialog} hideDialog={this.props.hideDialog} leagueSelect={this.props.leagueSelect} selectLeague={this.props.selectLeague}></Header>
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
          third: ThirdRoute
        })}
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

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight
  },
  scene: {
    flex: 1,
  },
});