import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {Routes} from './src/routes';
import theme from './src/theme';

export default function App() {

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle='light-content' />
        <Routes />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
