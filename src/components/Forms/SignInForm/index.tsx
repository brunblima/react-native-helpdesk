import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native'

import auth from '@react-native-firebase/auth'

import { FooterButton } from '../../Controllers/FooterButton';
import { Button } from '../../Controllers/Button';
import { Input } from '../../Controllers/Input';
import { Form, Title, Footer } from './styles';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  function isEmailValid(email:string) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }
  async function doesEmailExist(email:string) {
    try {
      const methods = await auth().fetchSignInMethodsForEmail(email);
      return methods.length > 0;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function handleSignIn() {
    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setIsLoading(false)
        console.log(error)
      });
  }

  function handleForgotPassword() {
    if (isEmailValid(email)) {
      doesEmailExist(email)
        .then(emailExists => {
          if (emailExists) {
            auth()
              .sendPasswordResetEmail(email)
              .then(() => Alert.alert('Redefinir Senha', 'Enviamos um e-mail para você'))
              .catch(error => console.log(error));
          } else {
            Alert.alert('E-mail não encontrado', 'Digite um e-mail válido ou registre-se.');
          }
        })
        .catch(error => console.log(error));
    } else {
      Alert.alert('E-mail Inválido', 'Digite um e-mail válido');
    }
  }

  return (
    <Form>
      <Title>Entrar</Title>
      <Input placeholder="E-mail" onChangeText={setEmail} />
      <Input placeholder="Senha" secureTextEntry onChangeText={setPassword} />
      <Button title="Entrar" onPress={handleSignIn} isLoading={isLoading} />

      <Footer>
        <FooterButton title="Criar conta" icon="person-add" onPress={() => navigation.navigate('register')} />
        <FooterButton title="Esqueci senha" icon="email" onPress={handleForgotPassword} />
      </Footer>
    </Form>
  );
}