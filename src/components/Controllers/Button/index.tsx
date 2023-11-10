import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { View, Container, Title, Load } from './styles';

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
};

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <View>
    <Container disabled={isLoading} {...rest}>
      {isLoading ? <Load /> : <Title>{title}</Title>}
    </Container>
    </View>
  )
}
