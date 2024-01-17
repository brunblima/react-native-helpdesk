import React, {useEffect, useState} from 'react';
import {useTheme} from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

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
  status: 'open' | 'closed' | 'in_progress';
  selectedType: string;
  selectedDevice: string;
  selectedSector: string;
  typeService: string;
  devices: {label: string; value: string}[];
  remoteaccess: string;
  location: string;
  description: string;
  create_at: any;
  closed_at: any;
  images: string[];
  createdBy: string;
  userId: string;
  solution: string;
}

type Props = {
  data: OrderProps;
  onOrderPress: (order: OrderProps) => void;
};

export function Order({data, onOrderPress}: Props) {
  const theme = useTheme();
  const formattedDate = data.create_at
    ? data.create_at.toDate().toLocaleString()
    : 'Data indisponível';

  const handleOrderPress = () => {
    onOrderPress(data);
  };
  const [creatorUsername, setCreatorUsername] = useState<string>('');

  useEffect(() => {
    const fetchCreatorUsername = async () => {
      try {
        const userSnapshot = await firestore()
          .collection('users')
          .doc(data.createdBy)
          .get();

        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          if (userData && userData.username) {
            setCreatorUsername(userData.username);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar o nome do usuário:', error);
      }
    };

    fetchCreatorUsername();
  }, [data.createdBy]);

  const renderIcon = () => {
    switch (data.status) {
      case 'open':
        return (
          <MaterialIcons
            name="hourglass-empty"
            size={24}
            color={theme.COLORS.SECONDARY}
          />
        );
      case 'closed':
        return (
          <MaterialIcons
            name="check-circle"
            size={24}
            color={theme.COLORS.PRIMARY}
          />
        );
      case 'in_progress':
        return (
          <MaterialCommunityIcons
            name="progress-clock"
            size={24}
            color={theme.COLORS.TERTIARY}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container onPress={() => onOrderPress(data)}>
      <Status status={data.status} />
      <Content>
        <IconWrapper>{renderIcon()}</IconWrapper>

        <Body>
          <BodyText style={{fontWeight: 'bold', paddingLeft:1}}>{data.typeService}</BodyText>
        </Body>

        {data.typeService !== 'Outros' && (
          <Body style={{paddingLeft: 2}}>
            <MaterialIcons
              name="devices-other"
              size={20}
              color={theme.COLORS.SUBTEXT}
            />
            <BodyText>{data.selectedType}</BodyText>
          </Body>
        )}

        {data.typeService !== 'Outros' && (
          <Body style={{paddingLeft: 2}}>
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
            <BodyText>{data.selectedDevice}</BodyText>
          </Body>
        )}

        {data.typeService !== 'Outros' && (
          <Body style={{paddingLeft: 2}}>
            {data.remoteaccess && (
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
        )}

        <Body style={{padding: 3}}>
          <Title>{data.description}</Title>
        </Body>
        <Footer>
          <Info>
            <MaterialIcons
              name="person"
              size={16}
              color={theme.COLORS.SUBTEXT}
            />
            <Label>{creatorUsername}</Label>
          </Info>

          {data.location !== '' && (
            <Info>
              <MaterialIcons
                name="my-location"
                size={16}
                color={theme.COLORS.SUBTEXT}
              />
              <Label>{data.location}</Label>
            </Info>
          )}

          <Info>
            <MaterialIcons
              name="schedule"
              size={16}
              color={theme.COLORS.SUBTEXT}
            />
            <Label>{formattedDate}</Label>
          </Info>
        </Footer>
      </Content>
    </Container>
  );
}
