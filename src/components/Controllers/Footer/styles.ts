import styled from 'styled-components/native';

export const FooterText = styled.Text`
    font-size: 14px;
    color: ${({ theme }) => theme.COLORS.SUBTEXT};
`;

export const ContainerFooter = styled.View`
    align-items: center;
    background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
    padding-bottom: 10px;
`