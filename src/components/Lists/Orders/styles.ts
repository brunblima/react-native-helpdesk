import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

export const Container = styled.View`
  flex: 1;
  margin-top: 10px; 
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 12px;
`;

export const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.COLORS.TEXT};
  margin-bottom: 12px;
  margin-left: 5px;
`;

export const Counter = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.SUBTEXT};
  margin-bottom: 12px;
  margin-right: 5px;
`;

export const Background = styled.View`
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 width: ${Dimensions.get('window').width}px;
 height: ${Dimensions.get('window').height}px;
 background-color: rgba(0,0,0,0.7);
`;

