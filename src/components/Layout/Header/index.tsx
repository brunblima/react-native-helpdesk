import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { LogoutButton } from '../../Controllers/LogoutButton';
import { Container, Greeting, SubTitle, Title } from './styles';

export function Header() {

  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Buscando informações do usuário atualmente autenticado
    const currentUser = auth().currentUser;

    if (currentUser) {
      // Obtendo o ID do usuário
      const userId = currentUser.uid;

      // Acessando a coleção 'users' no Firestore e buscando o documento do usuário
      const userRef = firestore().collection('users').doc(userId);
      userRef.get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          if (userData && userData.username) {
            setUserName(userData.username); // Definindo o nome do usuário para exibição
          }
        }
      });
    }
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