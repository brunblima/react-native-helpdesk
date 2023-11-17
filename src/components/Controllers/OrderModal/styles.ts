import styled from 'styled-components/native';
import {Dimensions} from 'react-native';

export const Background = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: ${Dimensions.get('window').width}px;
  height: ${Dimensions.get('window').height}px;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const Text = styled.Text`
  color: #121212;
`;
export const ImageThumbnail = styled.TouchableOpacity`
  margin-bottom: 10px;
  padding: 5px;
`;

export const ThumbnailImage = styled.Image`
  width: 100px;
  height: 100px;
`;

export const FullScreenModal = styled.Modal``; // Estilos do modal em tela cheia

export const FullScreenView = styled.TouchableOpacity`
  /* Estilos da view em tela cheia */
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: black;
`;

export const FullScreenImage = styled.Image`
  /* Estilos da imagem em tela cheia */
  width: 100%;
  height: 100%;
`;
export const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;
