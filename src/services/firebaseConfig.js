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

const FIREBASE_SERVER_KEY =
  'AAAAW-_lWzY:APA91bHBW7k6KrtyUkDh0qTU_t8lOk5VrSXIf004EHDUDwsw6faJ0QP6bHvwMQfqen70PbY1S5e57bGIOLUM88V1TDRVgdnwi8Up5GKh77sD5dB_JBwBfreRbpizo-y7kv5QHAL-BxTf';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export { firebase, FIREBASE_SERVER_KEY };
