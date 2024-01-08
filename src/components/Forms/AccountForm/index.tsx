import React, {useState} from 'react';
import {Alert, View, TouchableOpacity} from 'react-native';

import {Button} from '../../Controllers/Button';
import {Input} from '../../Controllers/Input';
import {Form, Title} from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export function AccountForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleNewAccount() {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async userCredential => {
        const currentUser = userCredential.user;

        if (currentUser) {
          await messaging().registerDeviceForRemoteMessages();
          const token = await messaging().getToken();
          await firestore().collection('users').doc(currentUser.uid).set({
            email,
            username,
            userType,
            token,
          });
          
          Alert.alert('Conta', 'Cadastrado com Sucesso');
        } else {
          Alert.alert('Erro', 'Não foi possível criar a conta');
        }
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Form>
      <Title>Cadastrar</Title>
      <Input placeholder="Nome e Sobrenome" onChangeText={setUsername} />
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

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Input
          placeholder="Confirme a senha"
          secureTextEntry={!showConfirmPassword}
          onChangeText={text => setConfirmPassword(text)}
        />
        <TouchableOpacity
          onPress={toggleConfirmPasswordVisibility}
          style={{position: 'absolute', right: 15, top: 16}}>
          <MaterialIcons
            name={showConfirmPassword ? 'visibility-off' : 'visibility'}
            size={26}
            color={'#000'}
          />
        </TouchableOpacity>
      </View>
      <Button
        title="Cadastrar"
        isLoading={isLoading}
        onPress={handleNewAccount}
      />
    </Form>
  );
}
