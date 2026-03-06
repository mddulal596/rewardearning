const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "reward-earning-d8165.firebaseapp.com",
    databaseURL: "https://reward-earning-d8165-default-rtdb.firebaseio.com",
    projectId: "reward-earning-d8165",
    storageBucket: "reward-earning-d8165.appspot.com",
    messagingSenderId: "175054692652",
    appId: "1:175054692652:web:b26cc70cb0cc1aeb8e0c89"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
