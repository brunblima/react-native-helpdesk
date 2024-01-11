import React, {useState} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import {Input} from '../Input';
import {Button} from '../Button';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const NewPassword = () => {
  const [user, setUser] = useState(auth().currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async () => {
    setIsLoading(true);

    // Verifica se os campos foram preenchidos
    if (newPassword.trim() === '' || newPasswordConfirm.trim() === '') {
      Alert.alert('Por favor, preencha ambos os campos de senha.');
      setIsLoading(false);
      return;
    }

    if (newPassword === newPasswordConfirm) {
      if (user) {
        try {
          // Reautenticar o usuário antes de tentar alterar a senha
          const credential = auth.EmailAuthProvider.credential(
            user.email as string,
            currentPassword,
          );
          await user.reauthenticateWithCredential(credential);

          // Reautenticação bem-sucedida, agora podemos alterar a senha
          await user.updatePassword(newPassword);
          Alert.alert('Senha atualizada com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar senha:', error);
          Alert.alert('Erro ao atualizar senha. Tente novamente mais tarde.');
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      Alert.alert(
        'As senhas não coincidem. Por favor, insira senhas iguais nos dois campos.',
      );
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  return (
    <View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Input
          placeholder="Senha Atual"
          secureTextEntry={!showCurrentPassword}
          onChangeText={text => setCurrentPassword(text)}
        />
        <TouchableOpacity
          onPress={toggleCurrentPasswordVisibility}
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
          placeholder="Nova senha"
          secureTextEntry={!showPassword}
          onChangeText={text => setNewPassword(text)}
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
          placeholder="Confirme a nova senha"
          secureTextEntry={!showConfirmPassword}
          onChangeText={text => setNewPasswordConfirm(text)}
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
        title="Alterar senha"
        isLoading={isLoading}
        onPress={handlePasswordChange}
      />
    </View>
  );
};
