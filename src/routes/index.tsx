import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {Home} from '../screens/Home';
import {AuthRoutes} from './auth.routes';

export function Routes() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser);

    return subscriber;
  }, []);
  

  return (
    <NavigationContainer>
      { user ? <Home/> : <AuthRoutes />}
    </NavigationContainer>
  );
}
