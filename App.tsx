// App.tsx
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import messaging from '@react-native-firebase/messaging';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { Routes } from './src/routes';
import theme from './src/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const initializeFirebaseMessaging = async () => {
      try {
        const initialToken = await messaging().getToken();
        setToken(initialToken || '');
        setInitializing(false);
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    initializeFirebaseMessaging();
  }, []);

  useEffect(() => {
    if (!initializing) {
      const unsubscribe = messaging().onTokenRefresh(newToken => {
        console.log('FCM Token refreshed:', newToken);
        setToken(newToken || '');
      });

      return unsubscribe;
    }
  }, [initializing]);

  useEffect(() => {
    if (!initializing) {
      const saveTokenToFirestore = async () => {
        try {
          const user = auth().currentUser;
          if (user) {
            await firestore().collection('users').doc(user.uid).update({ fcmToken: token });
          }
        } catch (error) {
          console.error('Error saving FCM token to Firestore:', error);
        }
      };

      saveTokenToFirestore();
    }
  }, [initializing, token]);

  useEffect(() => {
    if (!initializing) {
      const unsubscribe = messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
        // Manipulate a mensagem recebida em segundo plano aqui
      });

      return unsubscribe;
    }
  }, [initializing]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" />
        <Routes />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
