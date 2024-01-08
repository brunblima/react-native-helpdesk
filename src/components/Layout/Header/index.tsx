import React, {useEffect, useState} from 'react';
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

  function handleSignOut() {
    auth().signOut();
  }

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
