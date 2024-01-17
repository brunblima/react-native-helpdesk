import React, {useEffect, useRef, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {View, Alert, ScrollView} from 'react-native';
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
import {FIREBASE_SERVER_KEY} from '../../../services/firebaseConfig';
import {Input} from '../Input';
import Modal from 'react-native-modal';
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
  const [solution, setSolution] = useState<string>('');
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const sendNotification = async (
    createdBy: string,
    title: string,
    body: string,
  ) => {
    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(createdBy)
        .get();
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

  const handleConfirmCloseOrder = () => {
    if (selectedOrder?.status === 'in_progress' && solution.length < 10) {
      Alert.alert('Erro', 'A solução deve ter pelo menos 10 caracteres.');
      return;
    }
    setConfirmationModalVisible(true);
  };

  const handleCloseOrder = async (solution: string) => {
    setIsLoading(true);

    try {
      if (selectedOrder?.status === 'in_progress' && solution.length < 10) {
        setIsLoading(false);
        Alert.alert('Erro', 'A solução deve ter pelo menos 10 caracteres.');
        return;
      }

      const now = new Date();

      await firestore()
        .collection('orders')
        .doc(selectedOrder?.id)
        .update({status: 'closed', closed_at: now, solution: solution});

      handleCloseModal();
      setIsLoading(false);
      updateButtonStatus('closed');
      await sendNotification(
        selectedOrder?.createdBy || '',
        'Chamado Encerrado',
        'O chamado foi encerrado.',
      );
      setConfirmationModalVisible(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao processar ação:', error);
    }
  };

  const handleActionBasedOnStatus = () => {
    if (selectedOrder?.status === 'open') {
      handleAcceptOrder();
    } else if (selectedOrder?.status === 'in_progress') {
      handleConfirmCloseOrder();
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
        enableContentPanningGesture={false}
        ref={bottomSheetRef}
        index={0}
        snapPoints={['98%']}
        backdropComponent={BottomSheetBackdrop}
        onDismiss={handleCloseModal}
        >  
        <ScrollView>
          <View style={{padding: 20}}>
            {selectedOrder && (
              <>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>Status: </Text>
                  <Text>{statusTranslation[selectedOrder.status]}</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>Setor: </Text>
                  <Text>{selectedOrder.selectedSector}</Text>
                </View>

                {selectedOrder.selectedType !== '' && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>
                      Tipo do Dispositivo:{' '}
                    </Text>
                    <Text>{selectedOrder.selectedType}</Text>
                  </View>
                )}

                

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

                <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 15}}>
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

                {selectedOrder?.status !== 'open' && (
                  <View style={{alignItems: 'flex-start', marginTop: 20}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Resolução:{' '}
                    </Text>

                    <View style={{flex: 1}}>
                      <Text style={{flexWrap: 'wrap', fontSize: 16}}>
                        {selectedOrder.solution}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={{marginBottom: '30%'}}>
                  {isAdmin && selectedOrder?.status === 'in_progress' && (
                    <Input
                      placeholder="Digite a solução..."
                      style={{width: '100%', height: 100, textAlign: 'auto', textAlignVertical: 'top', paddingTop: 20}}
                      value={solution}
                      onChangeText={text => setSolution(text)}
                    />
                  )}

                  {isAdmin && selectedOrder?.status !== 'closed' && (
                    <View>
                      <Button
                        title={actionButtonText}
                        isLoading={isLoading}
                        onPress={handleActionBasedOnStatus}
                      />
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </BottomSheetModal>

      <Modal isVisible={isConfirmationModalVisible}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 20}}>
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
            Confirma o fechamento do chamado?
          </Text>
          <Button
            style={{width: '100%', height: 50, marginBottom: 10}}
            title="Confirmar"
            onPress={() => handleCloseOrder(solution)}
          />
          <Button
            style={{width: '100%', height: 50, backgroundColor: '#FF366A'}}
            title="Cancelar"
            onPress={() => setConfirmationModalVisible(false)}
          />
        </View>
      </Modal>
    </BottomSheetModalProvider>
  );
};

export default OrderModal;
