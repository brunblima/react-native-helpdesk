import React, {useState} from 'react';
import {Container} from './styles';
import {Header} from '../../components/Layout/Header';
import {Orders} from '../../components/Lists/Orders';
import {NewOrder} from '../../components/Controllers/NewOrder';
import OrderModal from '../../components/Controllers/OrderModal';
import {OrderProps} from '@components/Controllers/Order';

export function Home() {
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
        <OrderModal
          order={selectedOrder}
          setIsModalVisible={handleCloseModal}
        />
      )}
    </Container>
  );
}
