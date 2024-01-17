import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
`;

export const Greeting = styled.View`
  flex: 1; 
  align-items: center; 
  justify-content: center; 
  padding-left: 10%;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.COLORS.TEXT};
  padding-left:  10px;
`;

export const SubTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.SUBTEXT};
  padding-left: 10px;
`;
