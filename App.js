import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import * as Font from 'expo-font';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Screen/Home'
import Routes from './Routes/Routes'

const Stack = createStackNavigator();

let customFonts = {
  'MontserratRegular': require('./assets/Fonts/MontserratRegular.ttf'),
  'MontserratBold': require('./assets/Fonts/MontserratBold.ttf'),
};

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
  };
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this._loadFontsAsync();
  }
  render() {
    if (this.state.fontsLoaded) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home" screenOptions={({ route }) => ({
                headerShown:false})}>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Routes" component={Routes} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }else{
      return(
        <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#00AFEF" />
        </View>
      );
    }
  }
}