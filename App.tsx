import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {Routes} from './src/routes';
import theme from './src/theme';

import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  });

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('Usuario descartou a notificação');
          break;
        case EventType.ACTION_PRESS:
          console.log('Usuario tocou na notificação', detail.notification);
      }
    });
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        console.log('Usuario tocou na notificação', detail.notification);
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
