var admin = require("firebase-admin");

var serviceAccount = require("../controllers/utils/fcmapp-62021-firebase-adminsdk-fbsvc-94a76486d1.json");
const { default: axios } = require("axios");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendPushNotification = async (expoPushToken, title, body) => {
    const message = {
        to: expoPushToken, // Token dạng "ExponentPushToken[xxxxxx]"
        sound: "default",
        title,
        body,
        data: { extraData: "Some extra data" },
        priority: "high", // Đảm bảo thông báo không bị trì hoãn trên Android
    };

    try {
        const response = await axios.post("https://exp.host/--/api/v2/push/send", message, {
        headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        });

        console.log("✅ Notification sent:", response.data);
    } catch (error) {
        console.error("❌ Error sending notification:", error.response ? error.response.data : error.message);
    }
};

const sendPushFCMNotification = async (deviceToken, title, body) => {
  const message = {
    token: deviceToken,
    notification: {
      title,
      body,
      image:"https://res.cloudinary.com/dd0qffuvy/image/upload/v1742015336/my_upload/vcoorwosazj2crlshwdx.jpg"
    },
    data: {
      extraData: "Some extra data",
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = {sendPushNotification,sendPushFCMNotification}