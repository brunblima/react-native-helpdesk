import React, {useState} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styled from 'styled-components/native';
import {
  launchCamera,
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  ImageContainer,
  Image,
  RemoveButton,
  ButtonText,
  IconTouchable,
  ImageButton,
  SpaceBetween,
} from './styles';

interface ImagePickerProps {
    onSelectImage: (imageUri: string) => void;
    onRemoveImage: (imageUri: string) => void; // Função para remover uma imagem
  }
const ImagePicker: React.FC<ImagePickerProps> = ({onSelectImage, onRemoveImage}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const openImagePicker = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (
        !response.didCancel &&
        !response.errorMessage &&
        response.assets &&
        response.assets.length > 0
      ) {
        const selectedAsset = response.assets[0];
        const imageUri: string | undefined = selectedAsset.uri;
        if (imageUri) {
          onSelectImage(imageUri); 
          setSelectedImages(prevImages => [...prevImages, imageUri]);
        }
      }
    });
  };

  const handleCameraLaunch = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (
        !response.didCancel &&
        !response.errorMessage &&
        response.assets &&
        response.assets.length > 0
      ) {
        const selectedAsset = response.assets[0];
        const imageUri: string | undefined = selectedAsset.uri;
        if (imageUri) {
          onSelectImage(imageUri); 
          setSelectedImages(prevImages => [...prevImages, imageUri]);
        }
      }
    });
  };

  const removeImage = (imageUri: string) => {
    const updatedImages = selectedImages.filter((img) => img !== imageUri);
    setSelectedImages([...updatedImages]);
    onRemoveImage(imageUri); // Informa o componente pai sobre a remoção da imagem
  };


  return (
    <>
      <ImageButton>
        <IconTouchable onPress={openImagePicker}>
          <MaterialIcons name="photo-library" size={24} color={'#fff'} />
        </IconTouchable>
        <SpaceBetween />
        <IconTouchable onPress={handleCameraLaunch}>
          <MaterialIcons name="camera-alt" size={24} color={'#fff'} />
        </IconTouchable>
      </ImageButton>
      <Container>
        {selectedImages.map((imageUri, index) => (
          <ImageContainer key={index}>
            <Image source={{uri: imageUri}} />
            <RemoveButton onPress={() => removeImage(imageUri)}>
              <ButtonText>X</ButtonText>
            </RemoveButton>
          </ImageContainer>
        ))}
      </Container>
    </>
  );
};

export default ImagePicker;
