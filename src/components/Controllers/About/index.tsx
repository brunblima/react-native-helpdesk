import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Button} from '../Button';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';

export default function About() {
  const [ModalVisible, setModalVisible] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    const getAppVersion = async () => {
      const version = await DeviceInfo.getVersion();
      setAppVersion(version);
    };

    getAppVersion();
  }, []);

  const handleCloseOrder = async () => {
    setModalVisible(false);
  };

  return (
    <>
      <Button title={'Sobre'} onPress={() => setModalVisible(true)}></Button>

      <Modal isVisible={ModalVisible}>
        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 20}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#000',
            }}>
            Versão {appVersion}
          </Text>

          <Button
            style={{width: '100%', height: 50, backgroundColor: '#FF366A'}}
            title="Fechar"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}
