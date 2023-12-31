import React, {useEffect, useRef, useState} from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import messaging from '@react-native-firebase/messaging'

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {View, PermissionsAndroid} from 'react-native';
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
import { FIREBASE_SERVER_KEY } from '../../../services/firebaseConfig';

export interface OrderModalProps {
  order: OrderProps | null;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderModal: React.FC<OrderModalProps> = ({order, setIsModalVisible}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderProps | null>(order);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [currentUserType, setCurrentUserType] = useState('');
  const [actionButtonText, setActionButtonText] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  
  // function requestAndroidPermission() {
  //   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  // }
  // async function requestUserPermission() {
  //   const authorizationStatus = await messaging().requestPermission();
  
  //   if (authorizationStatus) {
  //     console.log('Permission status:', authorizationStatus);
  //   }
  // }

  const sendNotification = async (
    createdBy: string,
    title: string,
    body: string,
  ) => {
    try {
      const userDoc = await firestore().collection('users').doc(createdBy).get();
      const userData = userDoc.data();
      const userToken = userData?.fcmToken;

      if (!userToken) {
        console.error('Token FCM não encontrado para o usuário');
        return;
      }

      const message = {
        registration_ids: [userToken],
        notification: {
          title: title,
          body: body,
          vibrate: 1,
          sound: 1,
          priority: 'high',
          show_in_foreground: true,
          content_available: true,
          icon: 'ic_launcher', 
        },
        data: {
          title: 'data_title',
          body: 'data_body',
          extra: 'data_extra',
        },
      };

      let headers = new Headers({
        'Content-Type': 'application/json',
        Authorization: 'key=' + FIREBASE_SERVER_KEY,
      });
    
      let response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
      });
      response = await response.json();
      console.log(response);
      
      console.log('Notificação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar a notificação:', error);
    }
  };

  const updateButtonStatus = (status: string) => {
    if (status === 'in_progress') {
      setActionButtonText('Encerrar Chamado');
    } else if (status === 'open') {
      setActionButtonText('Atender Chamado');
    }
  };

  const handleAcceptOrder = async () => {
    setIsLoading(true);

    try {
      // Alterar o status da ordem para 'in_progress'
      await firestore()
        .collection('orders')
        .doc(selectedOrder?.id)
        .update({status: 'in_progress'});
      handleCloseModal();
      setIsLoading(false);
      updateButtonStatus('in_progress');
      await sendNotification(
        selectedOrder?.createdBy || '',
        'Chamado em Andamento',
        'Fique atento, pois podemos solicitar acesso remoto à sua máquina.',
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao processar ação:', error);
    }
  };

  const handleCloseOrder = async () => {
    setIsLoading(true);

    try {
      const now = new Date();

      await firestore()
        .collection('orders')
        .doc(selectedOrder?.id)
        .update({status: 'closed', closed_at: now});
      handleCloseModal();
      setIsLoading(false);
      updateButtonStatus('closed');
      await sendNotification(
        selectedOrder?.createdBy || '',
        'Chamado Encerrado',
        'O chamado foi encerrado.',
      );
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao processar ação:', error);
    }
  };

  const handleActionBasedOnStatus = () => {
    if (selectedOrder?.status === 'open') {
      handleAcceptOrder();
    } else if (selectedOrder?.status === 'in_progress') {
      handleCloseOrder();
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
      updateButtonStatus(order.status);
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
        snapPoints={['60%', '50%', '100%']}
        backdropComponent={BottomSheetBackdrop}
        onDismiss={handleCloseModal}>
        <View style={{padding: 20}}>
          {selectedOrder && (
            <>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Status: </Text>
                <Text>{statusTranslation[selectedOrder.status]}</Text>
              </View>

              {selectedOrder.selectedType !== '' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>
                    Tipo do Dispositivo:{' '}
                  </Text>
                  <Text>{selectedOrder.selectedType}</Text>
                </View>
              )}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Setor: </Text>
                <Text>{selectedOrder.selectedSector}</Text>
              </View>

              {selectedOrder.selectedDevice !== '' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>Dispositivo: </Text>
                  <Text>{selectedOrder.selectedDevice}</Text>
                </View>
              )}

              {selectedOrder.remoteaccess !== '' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>Acesso Remoto: </Text>
                  <Text>{selectedOrder.remoteaccess}</Text>
                </View>
              )}

              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Text style={{fontWeight: 'bold'}}>Descrição: </Text>

                <View style={{flex: 1}}>
                  <Text style={{flexWrap: 'wrap'}}>
                    {selectedOrder.description}
                  </Text>
                </View>
              </View>

              {selectedOrder.selectedType !== '' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>Local: </Text>
                  <Text>{selectedOrder.location}</Text>
                </View>
              )}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Aberto em: </Text>
                <Text>
                  {new Date(
                    selectedOrder.create_at._seconds * 1000,
                  ).toLocaleString()}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>Encerrado em: </Text>
                <Text>
                  {selectedOrder.closed_at
                    ? new Date(
                        selectedOrder.closed_at._seconds * 1000,
                      ).toLocaleString()
                    : 'Não encerrado ainda'}
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

              {isAdmin && (
                <View style={{marginTop: '40%'}}>
                  <Button
                    title={actionButtonText}
                    isLoading={isLoading}
                    onPress={handleActionBasedOnStatus}
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
