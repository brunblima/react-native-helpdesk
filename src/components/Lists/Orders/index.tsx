import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import {Load} from '../../../components/Animations/Load';
import {Filters} from '../../../components/Controllers/Filters';
import {Order, OrderProps} from '../../Controllers/Order';
import {Container, Header, Title, Counter} from './styles';

export interface OrdersProps {
  openModal: (order: OrderProps | null) => void;
}

export function Orders({openModal}: OrdersProps) {
  const [status, setStatus] = useState('open');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const handleOrderPress = (order: OrderProps) => {
    openModal(order);
  };

  useEffect(() => {
    setIsLoading(true);

    const subscribe = firestore()
      .collection('orders')
      .where('status', '==', status)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as OrderProps[];

        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a.create_at).getTime();
          const dateB = new Date(b.create_at).getTime();
          return dateA - dateB;
        });

        setOrders(data);
        setIsLoading(false);
      });
    return () => subscribe();
  }, [status]);

  return (
    <Container>
      <Filters onFilter={setStatus} />

      <Header>
        <Title>Chamados {status === 'open' ? 'aberto' : 'encerrado'}</Title>
        <Counter>{orders.length}</Counter>
      </Header>

      {isLoading ? (
        <Load />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Order data={item} onOrderPress={handleOrderPress} />
          )}
          showsVerticalScrollIndicator={true}
          style={{flex: 1}}
        />
      )}
    </Container>
  );
}
