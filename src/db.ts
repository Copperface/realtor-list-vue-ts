import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDKrlMM7nREvF7CJ1vavm8OwJ9MFBSYW0U',
  authDomain: 'realtor-list.firebaseapp.com',
  databaseURL: 'https://realtor-list.firebaseio.com',
  projectId: 'realtor-list',
  storageBucket: 'realtor-list.appspot.com',
  messagingSenderId: '96455463416',
  appId: '1:96455463416:web:e17b124424660c7e',
};

export default firebase.initializeApp(firebaseConfig).database();
