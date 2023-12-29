import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {StatusBar, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {ThemeProvider} from 'styled-components/native';
import {Routes} from './src/routes';
import theme from './src/theme';

import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging'

export default function App() {
  
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  
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
