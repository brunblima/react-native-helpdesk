import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import { Header } from '../../components/Layout/Header';
import { Orders } from '../../components/Lists/Orders';
import { NewOrder } from '../../components/Controllers/NewOrder';
import OrderModal, { OrderModalProps } from '../../components/Controllers/OrderModal';
import { OrderProps } from '@components/Controllers/Order';

interface HomeProps {
  openModal: (order: OrderProps | null) => void;
}

export function Home({ }: HomeProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = (order: OrderProps | null) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalVisible(false);
  };

  return (
    <Container>
      <Header />
      <Orders openModal={handleOpenModal} />
      <NewOrder />
      {isModalVisible && (
        <OrderModal order={selectedOrder} setIsModalVisible={handleCloseModal} />
      )}
    </Container>
  );
}
