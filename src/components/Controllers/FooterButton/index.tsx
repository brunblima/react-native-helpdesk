import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Container, Title } from './styles';

type Props = TouchableOpacityProps & {
  title: string;
  icon: keyof typeof MaterialIcons.GlyphMap;
}

export function FooterButton({ title, ...rest }: Props) {
  const theme = useTheme();

  return (
    <Container {...rest}>
      <MaterialIcons name={rest.icon as string} size={24} color={theme.COLORS.TEXT} />
      <Title>{title}</Title>
    </Container>
  );
}