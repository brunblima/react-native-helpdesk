import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 3%;
  padding: 1%;
`;

export const ImageContainer = styled.View`
  position: relative;
  margin-right: 10px;
`;

export const Image = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 10px;
`;

export const RemoveButton = styled(TouchableOpacity)`
  position: absolute;
  height: 20px;
  width: 20px;
  top: -7px;
  right: -7px;
  background-color: rgba(255, 0, 0, 0.7);
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  
`;

export const ButtonText = styled.Text`
  color: #fff;
`;

export const IconTouchable = styled(TouchableOpacity)`
  width: 48%;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

export const ImageButton = styled.View`
  width: 100%;
  flex-direction: row;
  margin-bottom: 0px;
  background-color: '#000';
  
`;
export const SpaceBetween = styled.View`
  width: 10px;
`;