import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  margin-top: 15px; 
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

