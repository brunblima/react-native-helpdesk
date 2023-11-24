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
  font-weight: 400;
`;

export const ImageThumbnail = styled.TouchableOpacity`
  padding: 5px;
`;

export const ThumbnailImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 20px;
`;

export const FullScreenModal = styled.Modal`

`;

export const FullScreenView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
 
`;

export const FullScreenImage = styled.Image`
  width: 100%;
  height: 100%;
  
`;

export const ModalContainer = styled.View`
  margin-top: 5px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.COLORS.BORDER};
  flex-wrap: wrap;
  flex-direction: row;
  border-radius: 20px;
  justify-content: center;
  height: auto;
  width: 100%;

`;
