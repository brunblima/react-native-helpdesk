import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LogoutButton} from '../../Controllers/LogoutButton';
import {Container, Greeting, SubTitle, Title} from './styles';

export function Header() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
  
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firestore().collection('users').doc(userId);
  
        try {
          const doc = await userRef.get();
          if (doc.exists) {
            const userData = doc.data();
            if (userData && userData.username) {
              setUserName(userData.username);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
    };
  
    const interval = setInterval(fetchUserData, 2000); 
  
    return () => clearInterval(interval);
  }, []);

  function handleSignOut()  {
    Alert.alert(
      'Logout',
      'Tem certeza que deseja fazer logout?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await auth().signOut();
              console.log('Usuário desconectado com sucesso.');
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          },
        },
      ],
    );
  };
  

  return (
    <Container>
      <Greeting>
        <Title>Central de Ajuda</Title>
        <SubTitle>Bem-vindo, {userName}!</SubTitle>
      </Greeting>
      <LogoutButton onPress={handleSignOut} />
    </Container>
  );
}
