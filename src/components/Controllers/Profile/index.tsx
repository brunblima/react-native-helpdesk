import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  launchImageLibrary,
  ImagePickerResponse,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Button} from '../Button';
import {NewPassword} from '@components/Controllers/NewPassword';
import {Header} from '@components/Layout/Header';
import Footer from '@components/Controllers/Footer';
import About from '@components/Controllers/About';

import {Background, Container} from './styles';
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const defaultAvatar = require('@assets/images/defaultAvatar.png');

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
                Alert.alert('Imagem atualizada com sucesso');
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
      imageOptionsBottomSheetRef.current?.dismiss();
    });
  };

  const removeImage = async () => {
    try {
      await storage()
        .ref(`avatars/${user?.uid}`)
        .delete();
      await firestore()
        .collection('users')
        .doc(user?.uid)
        .update({
          avatarUrl: null,
        });
      Alert.alert('Imagem Removida com Sucesso');
      setAvatarSource(defaultAvatar);
      imageOptionsBottomSheetRef.current?.dismiss();
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const renderAvatar = () => {
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
    imageOptionsBottomSheetRef.current?.present();
  }

  return (
    <Container>
      <Header />
      <View style={{alignItems: 'center', paddingTop: 20}}>
        {renderAvatar()}
        <Text
          style={{
            color: '#383B43',
            paddingTop: 15,
            fontSize: 16,
            fontWeight: '500',
          }}>
          {user?.email}
        </Text>
      </View>

      <View style={{alignItems: 'center', margin: 15, paddingTop: 20}}>
        <Button
          style={{width: '100%', marginBottom: 10}}
          title="Alterar senha"
          onPress={handleSnapPress}
        />

        <About />
      </View>

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Footer />
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
            <View>
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
          snapPoints={['50%', '65%']}
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
