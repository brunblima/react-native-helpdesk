import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {Home} from '../screens/Home';
import {AuthRoutes} from './auth.routes';
import {MainApp} from '../components/Controllers/Navigation/TabNavigation'

const Stack = createStackNavigator();

export function Routes() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser);

    return subscriber;
  }, []);
  
  

  return (
    <NavigationContainer>
     <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainApp" component={MainApp} />
        ) : (
          <Stack.Screen name="AuthRoutes" component={AuthRoutes} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
