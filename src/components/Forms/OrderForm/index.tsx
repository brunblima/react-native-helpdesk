import React, {useState, useEffect} from 'react';

import firestore from '@react-native-firebase/firestore';
import {Alert, View, Image} from 'react-native';
import {Form, Title, PickerStyled, PickerContainer} from './styles';
import {Input} from '../../Controllers/Input';
import {Button} from '../../Controllers/Button';
import {TextArea} from '../../Controllers/TextArea';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from '@components/Image';
import storage from '@react-native-firebase/storage';

export function OrderForm() {
  const [remoteaccess, setRemoteAccess] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [selecteDevice, setSelectedDevice] = useState('');
  const [deviceType, setDeviceType] = useState<
    {label: string; value: string}[]
  >([]);
  const [devices, setDevices] = useState<{label: string; value: string}[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');

  const handleNewOrder = async () => {
    setIsLoading(true);

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
        selectedType,
        devices,
        remoteaccess,
        description,
        location,
        status: 'open',
        create_at: firestore.FieldValue.serverTimestamp(),
        images: imageUrls, 
      })
      .then(() => Alert.alert('Chamado', 'Chamado aberto com sucesso!'))
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
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

  const getDeviceData = async () => {
    const deviceCollection = firestore().collection(selectedType);
    const snapshot = await deviceCollection.get();

    const deviceData = snapshot.docs.map(doc => ({
      label: doc.id,
      value: doc.id,
    }));

    return deviceData;
  };

  const handleImageSelection = (imageUri: string) => {
    setSelectedImages([...selectedImages, imageUri]);
  };
  const removeImage = (imageUri: string) => {
    setSelectedImages((prevImages) => prevImages.filter((img) => img !== imageUri));
  };


  useEffect(() => {
    (async () => {
      const deviceTypeData = await getDeviceTypeData();
      setDeviceType(deviceTypeData);

      if (selectedType) {
        const deviceData = await getDeviceData();
        setDevices(deviceData || []);
      }
    })();
  }, [selectedType]);


  return (
    <Form>
      <Title>Novo chamado</Title>

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
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </PickerStyled>
      </PickerContainer>

      <PickerContainer>
        <PickerStyled
          dropdownIconColor={'#000'}
          style={{color: '#000'}}
          selectedValue={selecteDevice}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedDevice(itemValue as string);
          }}>
          <Picker.Item label={'Nenhum dispositivo selecionado'} value={''} />
          {devices.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </PickerStyled>
      </PickerContainer>

      <Input placeholder="Acesso Remoto"  keyboardType="numeric"  maxLength={10} onChangeText={setRemoteAccess} />

      <TextArea placeholder="Descrição" onChangeText={setDescription} />

      <Input placeholder="Local/Sala" onChangeText={setLocation} />

      <ImagePicker onSelectImage={handleImageSelection} onRemoveImage={removeImage} />

      <Button
        title="Enviar chamado"
        isLoading={isLoading}
        onPress={handleNewOrder}
      />
    </Form>
  );
}
