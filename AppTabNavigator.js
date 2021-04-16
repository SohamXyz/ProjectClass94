import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator';
import AddAssignmentScreen from '../screens/AddAssignmentScreen';


export const AppTabNavigator = createBottomTabNavigator({
  Assignments : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/request-list.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Assignments",
    }
  },
  AddAssignment: {
    screen: AddAssignmentScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/request-book.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Add Assignment",
    }
  }
});
