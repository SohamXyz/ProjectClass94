import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import ViewAssignmentScreen from '../screens/ViewAssignmentScreen';





export const AppStackNavigator = createStackNavigator({
  AssignmentList : {
    screen : ViewAssignmentScreen,
    navigationOptions:{
      headerShown : false
    }
},
  
    initialRouteName: 'AssignmentList'
  }
);
