import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

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

export default firebase;
