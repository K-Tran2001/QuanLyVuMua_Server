


const admin = require("firebase-admin")
const serviceAccount = require("./utils/serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-firebase-7eed8-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports.PushNotification = async (req, res) => {
  const {deviceToken,title,body} = req.body
  console.log(deviceToken,title,body);
  
  const message = {
    notification:{
      title,body
    },
    token:"rtrhigjrjgkdn36453656jbfje"
  }
  try {
    const response = admin.messaging().send(message);
    console.log("response",response);
    res.json("push")
    
  } catch (error) {
    throw error;
    
  }
  };







