import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
  const [isAdmin, setIsAdmin] = useState(false);

  const handleOrderPress = (order: OrderProps) => {
    openModal(order);
  };

  useEffect(() => {
    setIsLoading(true);

    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;

      firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            setIsAdmin(userData?.userType === 'admin');
          }
        })
        .catch(error => {
          console.error('Error getting user document:', error);
        });
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);

    let ordersRef = firestore().collection('orders');

    const user = auth().currentUser;
    if (user && !isAdmin) {
      const userId = user.uid;
      ordersRef = ordersRef.where('createdBy', '==', userId);
    }

    const subscribe = ordersRef.onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as OrderProps[];

      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.create_at).getTime();
        const dateB = new Date(b.create_at).getTime();
        return dateA - dateB;
      });

      const openOrders = sortedData.filter(order => ['open', 'in_progress'].includes(order.status));
      const closedOrders = sortedData.filter(order => order.status === 'closed');

      if (status === 'open') {
        setOrders(openOrders);
      } else {
        setOrders(closedOrders);
      }

      setIsLoading(false);
    });

    return () => subscribe();
  }, [status, isAdmin]);

  const handleModalClose = () => {
    openModal(null);
    setStatus('open');
  };

  return (
    <Container>
      <Filters onFilter={setStatus} />

      <Header>
      <Title>Chamados {status === 'open' ? 'abertos' : 'encerrados'}</Title>
        <Counter>{status === 'open' ? orders.filter(order => order.status === 'open' || order.status === 'in_progress').length : orders.filter(order => order.status === 'closed').length}</Counter>
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
