import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-firebase-7eed8-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export default admin