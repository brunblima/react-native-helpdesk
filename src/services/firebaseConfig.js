import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCyVKFpNge_HGfkwX-bShpCepQjhcrvrB8",
  authDomain: "helpdesk-6f4ab.firebaseapp.com",
  projectId: "helpdesk-6f4ab",
  storageBucket: "helpdesk-6f4ab.appspot.com",
  messagingSenderId: "394866809654",
  appId: "1:394866809654:web:0ec87080415d067e3c3197"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Certifique-se de que messaging() esteja disponível antes de usá-lo
if (messaging()) {
  messaging()
    .registerDeviceForRemoteMessages()
    .then(() => {
      console.log('Dispositivo registrado para mensagens remotas');
    })
    .catch((error) => {
      console.error('Erro ao registrar o dispositivo para mensagens remotas:', error);
    });
}

export { messaging };
export default firebase;