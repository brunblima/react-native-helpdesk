import React, {useState} from 'react';
import {useTheme} from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Container,
  Status,
  Content,
  Header,
  Title,
  Label,
  Info,
  Footer,
  OrderStyleProps,
  Body,
  BodyText,
  IconWrapper,
} from './styles';

export interface OrderProps {
  id: string;
  status: 'open' | 'closed';
  selectedType: string;
  devices: { label: string; value: string }[];
  remoteaccess: string;
  location: string;
  equipment: string;
  description: string;
  create_at: any;
  images: string[];
}

type Props = {
  data: OrderProps;
  onOrderPress: (order: OrderProps) => void;
};

export function Order({data, onOrderPress }: Props) {
  const theme = useTheme();
  const formattedDate = data.create_at.toDate().toLocaleString();
  const deviceValues = data.devices.map(device => device.value);
  
  const handleOrderPress = () => {
    onOrderPress(data);
  };

  
  return (
    <Container onPress={() => onOrderPress(data)}>
      <Status status={data.status} />
      <Content>
        <IconWrapper>
          <MaterialIcons
            name={data.status === 'open' ? 'hourglass-empty' : 'check-circle'}
            size={24}
            color={
              data.status === 'open'
                ? theme.COLORS.SECONDARY
                : theme.COLORS.PRIMARY
            }
          />
        </IconWrapper>
        <Body>
          <MaterialIcons
            name="devices-other"
            size={20}
            color={theme.COLORS.SUBTEXT}
          />
          <BodyText>{data.selectedType}</BodyText>
        </Body>
        <Body>
          {data.selectedType === 'Impressora' && (
            <>
              <MaterialIcons
                name="print"
                size={20}
                color={theme.COLORS.SUBTEXT}
              />
            </>
          )}

          {data.selectedType === 'Computador' && (
            <>
              <MaterialIcons
                name="computer"
                size={20}
                color={theme.COLORS.SUBTEXT}
              />
            </>
          )}
          {data.selectedType === 'Celular' && (
            <>
              <MaterialIcons
                name="smartphone"
                size={20}
                color={theme.COLORS.SUBTEXT}
              />
            </>
          )}
          {deviceValues.map((value, index) => (
            <BodyText key={index}>{value}</BodyText>
          ))}
        </Body>
        <Body>
          {data.remoteaccess && ( // Verifica se data.remoteaccess não está vazio
            <>
              <MaterialCommunityIcons
                name="remote-desktop"
                size={20}
                color={theme.COLORS.SUBTEXT}
              />
              <BodyText>{data.remoteaccess}</BodyText>
            </>
          )}
        </Body>

        <Body>
          <Title>{data.description}</Title>
        </Body>

        <Footer>
          <Info>
            <MaterialIcons
              name="schedule"
              size={16}
              color={theme.COLORS.SUBTEXT}
            />
            <Label>{formattedDate}</Label>
          </Info>

          <Info>
            <MaterialIcons
              name="my-location"
              size={16}
              color={theme.COLORS.SUBTEXT}
            />
            <Label>{data.location}</Label>
          </Info>
        </Footer>
      </Content>
    </Container>
  );
}
