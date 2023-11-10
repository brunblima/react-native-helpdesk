import styled from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';

export const Form = styled.View`
  width: 100%;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.COLORS.TEXT};
  margin-bottom: 24px;
  align-self: center;
`;

export const PickerContainer = styled.View`
  width: 100%;
  height: 56px;
  border: 1px solid ${({ theme }) => theme.COLORS.BORDER};;
  border-radius: 12px;
  margin-bottom: 12px;
`;

export const PickerStyled = styled(Picker)`
  width: 100%;
  height: 56px;
  padding: 8px;
`;

