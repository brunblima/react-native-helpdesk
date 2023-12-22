import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {StatusBar, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {ThemeProvider} from 'styled-components/native';
import {Routes} from './src/routes';
import theme from './src/theme';

import notifee, {EventType} from '@notifee/react-native';
import {messaging} from './src/services/firebaseConfig';

export default function App() {
  
  useEffect(() => {
    const requestNotificationPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
      if (enabled) {
        console.log('Permissão para notificações concedida');
      } else {
        console.log('Permissão para notificações negada');
      }
    };
  
    requestNotificationPermission();
  
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      // Trate a notificação recebida em primeiro plano
      console.log('Notificação em primeiro plano:', remoteMessage);
    });
  
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // Trate a notificação recebida em segundo plano
      console.log('Notificação em segundo plano:', remoteMessage);
    });
  
    return () => {
      unsubscribeForeground();
    };
  }, []);
  
  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('Usuário descartou a notificação');
          break;
        case EventType.ACTION_PRESS:
          console.log('Usuário tocou na notificação', detail.notification);
          break;
        case EventType.PRESS:
          console.log('Usuário tocou na notificação', detail.notification);
          break;
      }
    });
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" />
        <Routes />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
