
const axios = require("axios");
const BaseResponse = require("./BaseResponse");
const { sendPushNotification, sendPushFCMNotification } = require("../helpers/sendNotify");




// var admin = require("firebase-admin");

// var serviceAccount = require("./utils/fcmapp-62021-firebase-adminsdk-fbsvc-94a76486d1.json");
// const { sendPushNotification, sendPushFCMNotification } = require("../helpers/sendNotify");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

module.exports.GetToken = async (req, res) => {
  let response = new BaseResponse();
    try {
        const { token = null, title,message } = req.body
        var deviceToken = "ExponentPushToken[hozTi8LIfsOZb2iQzc_nrG]"
        if(token != null){
          deviceToken = token
        }
        console.log("deviceToken",deviceToken);
        
        const resusult = sendPushNotification(deviceToken,title,message)
        response.success = true
        response.data = resusult;
        response.message = "Push successfully";
        res.json(response);
    } catch (error) {
        response.success = false;
        response.message = error.toString();
        response.data = null;
        res.status(500).json(response);
    }
};

module.exports.PushNotification = async (req, res) => {
  let response = new BaseResponse();
    try {
        const res = sendPushNotification(req.body.token,"Thong báo","hello")
        response.success = true
        response.data = res;
        response.message = "Push successfully";
        res.json(response);
    } catch (error) {
        response.success = false;
        response.message = error.toString();
        response.data = null;
        res.status(500).json(response);
    }
};


// const sendPushNotification = async (expoPushToken, title, body) => {
//   const message = {
//     to: expoPushToken, // Token dạng "ExponentPushToken[xxxxxx]"
//     sound: "default",
//     title,
//     body,
//     data: { extraData: "Some extra data" },
//     priority: "high", // Đảm bảo thông báo không bị trì hoãn trên Android
//   };

//   try {
//     const response = await axios.post("https://exp.host/--/api/v2/push/send", message, {
//       headers: {
//         Accept: "application/json",
//         "Accept-Encoding": "gzip, deflate",
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("✅ Notification sent:", response.data);
//   } catch (error) {
//     console.error("❌ Error sending notification:", error.response ? error.response.data : error.message);
//   }
// };




module.exports.GetFCMToken = async (req, res) => {
  let response = new BaseResponse();
    try {
        const { token = null, title,message } = req.body
        var deviceToken = "ExponentPushToken[kM-YHKGLv7-hD6inWYw02y]"
        if(token != null){
          deviceToken = token
        }
        
        const resusult = sendPushFCMNotification(deviceToken,title,message)
        response.success = true
        response.data = resusult;
        response.message = "Push successfully";
        res.json(response);
    } catch (error) {
        response.success = false;
        response.message = error.toString();
        response.data = null;
        res.status(500).json(response);
    }
};

module.exports.PushFCMNotification = async (req, res) => {
  let response = new BaseResponse();
    try {
        const res = sendPushFCMNotification(req.body.token,"Thong báo","hello")
        response.success = true
        response.data = res;
        response.message = "Push successfully";
        res.json(response);
    } catch (error) {
        response.success = false;
        response.message = error.toString();
        response.data = null;
        res.status(500).json(response);
    }
};

// {
//   "displayName": "Istagram",
//   "state": "RUNNING",
//   "onStart": {},
//   "notificationOptions": {
//       "messageText": "1 thông báo mới",
//       "messageTitle": "Istagram",
//       "hasSound": false,
//       "imageUrl": "https://res.cloudinary.com/dd0qffuvy/image/upload/v1742015336/my_upload/vcoorwosazj2crlshwdx.jpg",
//       "expiryTime": "2419200s",
//       "registrationIds": [
//           "fMyL2hgFS2yL49x5MsQKPA:APA91bEKyrmA3NFgiDq9X4Jckqm1esbhR1A00JbaEeQKkWC2ov5e7ULcjG0GuDtblKMgojnmV6ciioh29JXYY0yRC4U-8hGIpYXzNmVzqHrw0FJT7hjwtvE"
//       ]
//   },
//   "dataBundle": {}
// }

// sendPushFCMNotification = async (deviceToken, title, body) => {
//   const message = {
//     token: deviceToken,
//     notification: {
//       title,
//       body,
//       image:"https://res.cloudinary.com/dd0qffuvy/image/upload/v1742015336/my_upload/vcoorwosazj2crlshwdx.jpg"
//     },
//     data: {
//       extraData: "Some extra data",
//     },
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("Notification sent successfully:", response);
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// };








