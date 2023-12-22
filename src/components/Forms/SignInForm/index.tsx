import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Alert, View, TouchableOpacity} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {FooterButton} from '../../Controllers/FooterButton';
import {Button} from '../../Controllers/Button';
import {Input} from '../../Controllers/Input';
import {Form, Title, Footer} from './styles';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();

  function isEmailValid(email: string) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }
  async function doesEmailExist(email: string) {
    try {
      const methods = await auth().fetchSignInMethodsForEmail(email);
      return methods.length > 0;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSignIn() {
    setIsLoading(true);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const {user} = userCredential;

      if (user) {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        await firestore()
          .collection('users')
          .doc(user.uid)
          .update({fcmToken: token});
      }
    } catch (error) {
      Alert.alert(
        'Erro ao entrar',
        'Verifique suas credenciais e tente novamente',
      );
      console.error('Erro ao fazer login:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleForgotPassword() {
    if (isEmailValid(email)) {
      doesEmailExist(email)
        .then(emailExists => {
          if (emailExists) {
            auth()
              .sendPasswordResetEmail(email)
              .then(() =>
                Alert.alert('Redefinir Senha', 'Enviamos um e-mail para você'),
              )
              .catch(error => console.log(error));
          } else {
            Alert.alert(
              'E-mail não encontrado',
              'Digite um e-mail válido ou registre-se.',
            );
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
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Input
          placeholder="Senha"
          secureTextEntry={!showPassword}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={{position: 'absolute', right: 15, top: 16}}>
          <MaterialIcons
            name={showPassword ? 'visibility-off' : 'visibility'}
            size={26}
            color={'#000'}
          />
        </TouchableOpacity>
      </View>
      <Button title="Entrar" onPress={handleSignIn} isLoading={isLoading} />

      <Footer>
        <FooterButton
          title="Criar conta"
          icon="person-add"
          onPress={() => navigation.navigate('register')}
        />
        <FooterButton
          title="Esqueci senha"
          icon="email"
          onPress={handleForgotPassword}
        />
      </Footer>
    </Form>
  );
}
