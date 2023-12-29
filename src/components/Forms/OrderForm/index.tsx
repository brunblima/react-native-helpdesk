import React, {useState, useEffect} from 'react';

import {Alert, ScrollView} from 'react-native';
import {Form, Title, PickerStyled, PickerContainer} from './styles';
import {Input} from '../../Controllers/Input';
import {Button} from '../../Controllers/Button';
import {TextArea} from '../../Controllers/TextArea';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from '@components/Image';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FIREBASE_SERVER_KEY } from '../../../services/firebaseConfig'

export function OrderForm() {
  const [remoteaccess, setRemoteAccess] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');
  const [deviceType, setDeviceType] = useState<
    {label: string; value: string}[]
  >([]);
  const [devices, setDevices] = useState<{label: string; value: string}[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [sectors, setSectors] = useState<string[]>([]);
  const [typeService, setTypeService] = useState('');
  const [type, setType] = useState<string[]>([]);
  
  const handleNewOrder = async () => {
    setIsLoading(true);

    const user = auth().currentUser;

    if (user) {
      const userId = user.uid;

      const imageUrls = [];
      for (const image of selectedImages) {
        const imageRef = storage().ref(`images/${image}`);
        const response = await imageRef.putFile(image);

        if (response.state === 'success') {
          const imageUrl = await imageRef.getDownloadURL();
          imageUrls.push(imageUrl);
        } else {
          console.log('Erro ao enviar a imagem', image);
        }
      }
      firestore()
        .collection('orders')
        .add({
          typeService,
          selectedType,
          selectedDevice,
          remoteaccess,
          description,
          location,
          selectedSector,
          status: 'open',
          create_at: firestore.FieldValue.serverTimestamp(),
          images: imageUrls,
          createdBy: userId,
        })
        .then(() => Alert.alert('Chamado', 'Chamado aberto com sucesso!'))
        .catch(error => console.log(error))
        .finally(() => setIsLoading(false));
    }
    await sendAdminNotification(
      'Novo Chamado',
      'Um novo chamado foi aberto.'
    );
      
  };
  const sendAdminNotification = async (
    title: string,
    body: string,
  ) => {
    try {
      const adminUsersSnapshot = await firestore()
        .collection('users')
        .where('userType', '==', 'admin')
        .get();
  
      adminUsersSnapshot.forEach(async adminUserDoc => {
        const adminUserData = adminUserDoc.data();
        const adminUserToken = adminUserData?.fcmToken;
  
        if (adminUserToken) {
          const message = {
            registration_ids: [adminUserToken],
            notification: {
              title: title,
              body: body,
              vibrate: 1,
              sound: 1,
              priority: 'high',
              show_in_foreground: true,
              content_available: true,
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
          
          console.log('Notificação enviada para o administrador:', adminUserData.email);
        }
      });
  
      console.log('Notificações enviadas para os administradores com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar notificações para os administradores:', error);
    }
  };
  


  const getDeviceTypeData = async () => {
    const deviceTypeCollection = firestore().collection('deviceType');
    const snapshot = await deviceTypeCollection.get();

    const deviceTypeData = snapshot.docs.map(doc => ({
      label: doc.id,
      value: doc.id,
    }));

    return deviceTypeData;
  };

  const getTypesData = async () => {
    const TypesCollection = firestore().collection('Type');
    const snapshot = await TypesCollection.get();

    const TypesData = snapshot.docs.map(doc => doc.id);

    return TypesData;
  };

  const getSectorData = async () => {
    const sectorsCollection = firestore().collection('Setor');
    const snapshot = await sectorsCollection.get();

    const sectorData = snapshot.docs.map(doc => doc.id); // Obtém apenas os IDs dos documentos

    return sectorData;
  };

  const getDeviceData = async () => {
    if (selectedType && selectedSector) {
      if (selectedType !== 'Impressora') {
        const deviceCollection = firestore().collection(selectedType);
        const snapshot = await deviceCollection
          .where('setor', '==', selectedSector)
          .get();

        const devicesData = snapshot.docs.map(doc => ({
          label: doc.id,
          value: doc.id,
        }));

        return devicesData;
      } else {
        const deviceCollection = firestore().collection(selectedType);
        const snapshot = await deviceCollection.get();

        const devicesData = snapshot.docs.map(doc => ({
          label: doc.id,
          value: doc.id,
        }));

        return devicesData;
      }
    }
    return [];
  };

  const handleImageSelection = (imageUri: string) => {
    setSelectedImages([...selectedImages, imageUri]);
  };
  const removeImage = (imageUri: string) => {
    setSelectedImages(prevImages => prevImages.filter(img => img !== imageUri));
  };

  useEffect(() => {
    (async () => {
      const deviceTypeData = await getDeviceTypeData();
      setDeviceType(deviceTypeData);
      const sectorData = await getSectorData();
      setSectors(sectorData || []);
      const typesData = await getTypesData();
      setType(typesData || []);

      if (selectedType && selectedSector) {
        const deviceData = await getDeviceData();
        setDevices(deviceData || []);
      }
    })();
  }, [selectedType, selectedSector]);

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 100}}>
      <Form>
        <Title>Novo chamado</Title>

        <PickerContainer>
          <PickerStyled
            dropdownIconColor={'#000'}
            style={{color: '#000'}}
            selectedValue={typeService}
            onValueChange={(itemValue, itemIndex) => {
              setTypeService(itemValue as string);
            }}>
            <Picker.Item label={'Selecione o tipo do Atendimento'} value={''} />
            {type.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </PickerStyled>
        </PickerContainer>

        {typeService === 'Dispositivo' && (
          <PickerContainer>
            <PickerStyled
              dropdownIconColor={'#000'}
              style={{color: '#000'}}
              selectedValue={selectedType}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedType(itemValue as string);
                setDevices([]);
                setSelectedDevice('');
              }}>
              <Picker.Item
                label={'Nenhum tipo de dispositvo selecionado'}
                value={''}
              />
              {deviceType.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </PickerStyled>
          </PickerContainer>
        )}

        <PickerContainer>
          <PickerStyled
            dropdownIconColor={'#000'}
            style={{color: '#000'}}
            selectedValue={selectedSector}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedSector(itemValue as string);
            }}>
            <Picker.Item label={'Nenhum setor selecionado'} value={''} />
            {sectors.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </PickerStyled>
        </PickerContainer>

        {typeService === 'Dispositivo' && (
          <PickerContainer>
            <PickerStyled
              dropdownIconColor={'#000'}
              style={{color: '#000'}}
              selectedValue={selectedDevice}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedDevice(itemValue as string);
              }}>
              <Picker.Item
                label={'Nenhum dispositivo selecionado'}
                value={''}
              />
              {devices.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </PickerStyled>
          </PickerContainer>
        )}

        {typeService === 'Dispositivo' &&
        (selectedType === 'Computador' || selectedType === 'Celular') ? (
          <Input
            placeholder="Acesso Remoto"
            keyboardType="numeric"
            maxLength={10}
            onChangeText={setRemoteAccess}
          />
        ) : null}

        <TextArea placeholder="Descrição" onChangeText={setDescription} />

        <Input placeholder="Local/Sala" onChangeText={setLocation} />

        <ImagePicker
          onSelectImage={handleImageSelection}
          onRemoveImage={removeImage}
        />

        <Button
          title="Enviar chamado"
          isLoading={isLoading}
          onPress={handleNewOrder}
        />
      </Form>
    </ScrollView>
  );
}
