import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
    launchImageLibrary,
    ImagePickerResponse,
    ImageLibraryOptions,
  } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export const ChangePhoto = ({ updateProfilePhoto }: { updateProfilePhoto: (newPhotoUri: string) => void }) => {
    const [user, setUser] = useState(auth().currentUser);

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
    
                    updateProfilePhoto(downloadURL);
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
          if (user) {
            await firestore().collection('users').doc(user.uid).update({
              avatarUrl: firestore.FieldValue.delete(),
            });
          }
          setAvatarSource(defaultAvatar);
          setBottomSheetVisible(false);
        } catch (error) {
          console.error('Error removing image:', error);
        }
      };

  return (
    <View>
      <TouchableOpacity onPress={selectImage}>
        <Text style={{padding: 20}}>Alterar imagem</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={removeImage}>
        <Text style={{padding: 20}}>Remover Imagem</Text>
      </TouchableOpacity>
    </View>
  );
};
