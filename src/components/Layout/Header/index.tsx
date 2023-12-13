import React from 'react';
import auth from '@react-native-firebase/auth'
import { LogoutButton } from '../../Controllers/LogoutButton';
import { Container, Greeting, Title } from './styles';

export function Header() {
  function handleSignOut() {
    auth().signOut();
   }

  return (
    <Container>
      <Greeting>
        <Title>Central de Ajuda</Title>
      </Greeting>
      <LogoutButton onPress={handleSignOut} />
    </Container>
  );
}