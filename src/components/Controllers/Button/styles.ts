import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const View = styled.View`
  width: 100%;
  margin-bottom: 1px;
  padding-left: 1px;
  padding-right: 1px;
`;
export const Container = styled(TouchableOpacity)`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.COLORS.WHITE};
`;

export const Load = styled.ActivityIndicator.attrs(({ theme }) => ({
  color: theme.COLORS.WHITE
}))``;