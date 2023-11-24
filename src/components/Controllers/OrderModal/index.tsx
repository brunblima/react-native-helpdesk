// ordermodal.tsx
import React, {useEffect, useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {View, Alert} from 'react-native';
import {OrderProps} from '../Order';
import {
  Text,
  ImageThumbnail,
  ThumbnailImage,
  FullScreenModal,
  FullScreenView,
  FullScreenImage,
  ModalContainer,
} from './styles';
import Swiper from 'react-native-swiper';
import {Button} from '../Button';

export interface OrderModalProps {
  order: OrderProps | null;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderModal: React.FC<OrderModalProps> = ({order, setIsModalVisible}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(order);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [currentUserType, setCurrentUserType] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const handleAtenderChamado = async () => {
    try {
      setIsLoading(true);
  
      if (!selectedOrder) {
        console.error('Nenhuma ordem selecionada para atender.');
        setIsLoading(false);
        return;
      }
  
      await firestore()
        .collection('orders')
        .doc(selectedOrder.id)
        .update({ status: 'in_progress' });
  
      const user = await firestore()
        .collection('users')
        .doc(selectedOrder.userId)
        .get();
  
      const userToken = user.data()?.fcmToken;
      
      console.log(userToken);
  
      if (!userToken) {
        console.error('Token de usuário não encontrado.');
        setIsLoading(false);
        return;
      }
  
      // Crie um RemoteMessage para enviar a notificação
      const message = {
        data: {
          title: 'Seu chamado está sendo atendido!',
          body: 'O atendimento do seu chamado está em andamento.',
        },
        token: userToken,
      };
  
      await messaging().sendMessage(message);
  
      setIsLoading(false);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao atender o chamado:', error);
      // Lide com o erro (ex: exibindo uma mensagem para o usuário)
    }
  };
  

  const openImageFullSize = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageFullSize = () => {
    setSelectedImageIndex(null);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalVisible(false);
  };

  const statusTranslation = {
    open: 'Aberto',
    closed: 'Fechado',
    in_progress: 'Em andamento',
  };

  const isAdmin = currentUserType === 'admin';

  useEffect(() => {
    setSelectedOrder(order);
    if (order) {
      bottomSheetRef.current?.present();
    }
  }, [order]);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      const usersRef = firestore().collection('users');
      const userDoc = usersRef.doc(userId);

      userDoc.get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          if (data && data.userType) {
            setCurrentUserType(data.userType);
          }
        }
      });
    }
  }, []);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={['88%', '50%', '100%']}
        backdropComponent={BottomSheetBackdrop}
        onDismiss={handleCloseModal}>
        <View style={{padding: 20}}>
          {selectedOrder && (
            <>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Status: </Text>
                <Text>{statusTranslation[selectedOrder.status]}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Tipo do Dispositivo: </Text>
                <Text>{selectedOrder.selectedType}</Text>
              </View>
              {selectedOrder.devices.map((device, index) => (
                <View
                  key={index}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>Dispositivo: </Text>
                  <Text>{device.value}</Text>
                </View>
              ))}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Acesso Remoto: </Text>
                <Text>{selectedOrder.remoteaccess}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Descrição: </Text>
                <Text>{selectedOrder.description}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Local: </Text>
                <Text>{selectedOrder.location}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Aberto em: </Text>
                <Text>
                  {new Date(
                    selectedOrder.create_at._seconds * 1000,
                  ).toLocaleString()}
                </Text>
              </View>

              <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 20}}>
                Imagens anexadas
              </Text>
              <ModalContainer>
                {order?.images.map((image, index) => (
                  <ImageThumbnail
                    key={index}
                    onPress={() => openImageFullSize(index)}>
                    <ThumbnailImage source={{uri: image}} />
                  </ImageThumbnail>
                ))}
                <FullScreenModal
                  visible={selectedImageIndex !== null}
                  transparent={true}
                  onRequestClose={closeImageFullSize}>
                  <FullScreenView>
                    <Swiper
                      style={{height: '100%'}}
                      index={selectedImageIndex || 0}
                      loop={false}
                      onIndexChanged={index => setSelectedImageIndex(index)}>
                      {order?.images.map((image, index) => (
                        <View key={index}>
                          <FullScreenImage
                            source={{uri: image}}
                            resizeMode="contain"
                            style={{width: '100%', height: '100%'}}
                          />
                        </View>
                      ))}
                    </Swiper>
                  </FullScreenView>
                </FullScreenModal>
              </ModalContainer>

              {isAdmin && selectedOrder.status === 'open' && (
                <View style={{marginTop: '40%'}}>
                  <Button
                    title="Atender Chamado"
                    isLoading={isLoading}
                    onPress={() => handleAtenderChamado()}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default OrderModal;
