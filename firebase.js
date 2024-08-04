import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyC0ICZsBNL2GWR72PDRqmJ0abS2bgP2MD8",
    authDomain: "pantry-518e2.firebaseapp.com",
    projectId: "pantry-518e2",
    storageBucket: "pantry-518e2.appspot.com",
    messagingSenderId: "796916678664",
    appId: "1:796916678664:web:0f596402b11fb79bcb11bd"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };