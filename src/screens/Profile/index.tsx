import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  launchImageLibrary,
  ImagePickerResponse,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Button} from '../../components/Controllers/Button';
import {NewPassword} from '@components/Controllers/NewPassword';
import {Background, Container} from './styles';
const defaultAvatar = require('../../assets/images/avatar-default.png');

import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const Profile = () => {
  const [user, setUser] = useState(auth().currentUser);
  const [avatarSource, setAvatarSource] = useState<any>(null);

  const loadAvatar = async (uid: string) => {
    try {
      const userDoc = await firestore().collection('users').doc(uid).get();
      const avatarUrl = userDoc.data()?.avatarUrl;

      if (avatarUrl) {
        setAvatarSource({uri: avatarUrl});
      } else {
        setAvatarSource(defaultAvatar);
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (!response.didCancel) {
        if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];

          if (selectedImage.uri) {
            const storageRef = storage().ref(`avatars/${user?.uid}`);

            storageRef
              .putFile(selectedImage.uri)
              .then(async () => {
                const downloadURL = await storageRef.getDownloadURL();

                if (user) {
                  await firestore().collection('users').doc(user.uid).set(
                    {
                      avatarUrl: downloadURL,
                    },
                    {merge: true},
                  );
                }

                setAvatarSource({uri: selectedImage.uri});
              })
              .catch(error => {
                console.error('Error uploading image:', error);
              });
          } else {
            console.log('Image URI is undefined');
          }
        }
      } else {
        console.log('User cancelled image picker');
      }
    });
  };

  const removeImage = async () => {
    try {
      // Remove a imagem do usuário no armazenamento e no banco de dados
      await storage()
        .ref(`avatars/${user?.uid}`)
        .delete();
      await firestore()
        .collection('users')
        .doc(user?.uid)
        .update({
          avatarUrl: null,
        });
      setAvatarSource(defaultAvatar);
      bottomSheetRef.current?.dismiss(); // Fechar o Bottom Sheet após remover a imagem
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const renderAvatar = () => {
    // O onPress deve chamar a função handleSnapPress, não handlePress
    return (
      <TouchableOpacity onPress={changeImage}>
        <Image
          source={avatarSource || defaultAvatar}
          style={{width: 150, height: 150, borderRadius: 75}}
        />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (currentUser) {
        loadAvatar(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const imageOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  function handleSnapPress() {
    bottomSheetRef.current?.present();
  }

  function changeImage() {
    imageOptionsBottomSheetRef.current?.present(); // Fechar o Bottom Sheet após selecionar uma nova imagem
  }

  return (
    <Container>
      <View style={{alignItems: 'center', paddingTop: 20}}>
        {renderAvatar()}
        <Text style={{color: '#000', paddingTop: 10}}>
          Logado como: {user?.email}
        </Text>
      </View>

      <View style={{alignItems: 'center', margin: 15}}>
        <Button
          style={{width: '100%'}}
          title="Alterar senha"
          onPress={handleSnapPress}
        />
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          enableContentPanningGesture={false}
          ref={imageOptionsBottomSheetRef}
          snapPoints={['25%']}
          style={{padding: 24}}
          enablePanDownToClose={true}
          backdropComponent={() => <Background />}>
          <BottomSheetView>
            <View style={{}}>
              <Text style={{color: '#000', fontSize: 24}}>Foto de perfil</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={selectImage}>
                <MaterialIcons name={'photo'} size={40} color={'#000'} />
                <Text style={{color: '#000'}}>Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{alignItems: 'center', justifyContent: 'center'}}
                onPress={removeImage}>
                <MaterialIcons name={'delete'} size={40} color={'#000'} />
                <Text style={{color: '#000'}}>Remover</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <BottomSheetModalProvider>
        <BottomSheetModal
          enableContentPanningGesture={false}
          ref={bottomSheetRef}
          snapPoints={['50%']}
          style={{padding: 24}}
          enablePanDownToClose={true}
          backdropComponent={() => <Background />}>
          <BottomSheetView>
            <NewPassword />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </Container>
  );
};

export default Profile;
