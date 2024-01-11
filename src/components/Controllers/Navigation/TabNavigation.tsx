import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons'; 

import { Home } from '../../../screens/Home';
import Profile  from '../../../screens/Profile'; // Você precisa importar a tela do perfil ou qualquer outra tela que deseje adicionar

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export function MainApp() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = ''; 
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        tabBarLabelStyle: { fontSize: 16 },
        tabBarActiveTintColor: '#6100FF', 
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 50 }, 
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={Profile} options={{ headerShown: false }}  />
      {/* Adicione mais telas conforme necessário */}
    </Tab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      {/* Adicione mais telas Stack.Screen conforme necessário */}
    </Stack.Navigator>
  );
}
