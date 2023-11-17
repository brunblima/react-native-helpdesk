// ordermodal.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {View, Image} from 'react-native';
import {OrderProps} from '../Order';
import {Text} from './styles';

export interface OrderModalProps {
  order: OrderProps | null;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderModal: React.FC<OrderModalProps> = ({order, setIsModalVisible}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(order);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedOrder(order);
    if (order) {
      bottomSheetRef.current?.present();
    }
  }, [order]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={['88%', '50%', '100%']}
        backdropComponent={BottomSheetBackdrop}
        onDismiss={handleCloseModal}>
        <View style={{padding: 24}}>
          {selectedOrder && (
            <>
              <Text>Status: {selectedOrder.status}</Text>
              <Text>Tipo do Dispositivo: {selectedOrder.selectedType}</Text>
              {selectedOrder.devices.map((device, index) => (
                <Text key={index}>Dispositivo: {device.value}</Text>
              ))}
              <Text>Acesso Remoto: {selectedOrder.remoteaccess}</Text>
              <Text>Local: {selectedOrder.location}</Text>
              <Text>Equipamento: {selectedOrder.equipment}</Text>
              <Text>Descrição: {selectedOrder.description}</Text>
              <Text>
                Aberto em:{' '}
                {new Date(
                  selectedOrder.create_at._seconds * 1000,
                ).toLocaleString()}
              </Text>
              {selectedOrder.images.map((image, index) => (
                <Image
                  key={index}
                  source={{uri: image}}
                  style={{width: 200, height: 200}}
                />
              ))}
            </>
          )}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default OrderModal;
