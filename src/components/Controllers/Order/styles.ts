import styled from 'styled-components/native';

export type OrderStyleProps = {
  status: 'open' | 'closed' | 'in_progress';
};

export const Container = styled.TouchableOpacity`
  width: 100%;
  height: 180px;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 16px;
`;

export const Content = styled.View`
  width: 100%;
  padding: 5px 10px;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.COLORS.WHITE};
  border-radius: 0 20px 20px 0;
  flex-grow: 1;
`;

export const Header = styled.View`
  justify-content: flex-end;
  align-items: flex-end;
`;

export const Status = styled.View<OrderStyleProps>`
  width: 10px;
  height: 180px;
  background-color: ${({ theme, status }) => {
    switch (status) {
      case 'open':
        return theme.COLORS.SECONDARY;
      case 'closed':
        return theme.COLORS.PRIMARY;
      case 'in_progress':
        return theme.COLORS.TERTIARY;
    }
  }};
`;

export const Title = styled.Text`
  flex: 1;
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.TEXT};
`;

export const Body = styled.View`
 flex-direction: row;
`
export const BodyText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.COLORS.TEXT}; 
  padding-left: 4px;
`;

export const Info = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Footer = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  position: absolute;
  bottom: 0;
  padding: 5px;
  
`;
export const Label = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.COLORS.SUBTEXT};  
  margin-left: 3px;
`;

export const IconWrapper = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
`;