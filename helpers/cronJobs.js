 const cron = require("node-cron");
const { sendPushFCMNotification } = require("../controllers/pushNotifyController");



// Lên lịch gửi notify vào 9h sáng mỗi ngày
cron.schedule("0 9 * * *", ()=>{
    sendPushFCMNotification("fMyL2hgFS2yL49x5MsQKPA:APA91bEKyrmA3NFgiDq9X4Jckqm1esbhR1A00JbaEeQKkWC2ov5e7ULcjG0GuDtblKMgojnmV6ciioh29JXYY0yRC4U-8hGIpYXzNmVzqHrw0FJT7hjwtvE","Thông báo mới","Demo tinh năm cron!")
    
}, {
    timezone: "Asia/Ho_Chi_Minh"
});

cron.schedule("0 6 * * *", () => {
    sendPushFCMNotification(
        "fMyL2hgFS2yL49x5MsQKPA:APA91bEKyrmA3NFgiDq9X4Jckqm1esbhR1A00JbaEeQKkWC2ov5e7ULcjG0GuDtblKMgojnmV6ciioh29JXYY0yRC4U-8hGIpYXzNmVzqHrw0FJT7hjwtvE",  // Token thiết bị nhận thông báo
        "Thông báo buổi sáng",                // Tiêu đề
        "Chào buổi sáng! Đây là thông báo hàng ngày của bạn." // Nội dung
    );
}, {
    timezone: "Asia/Ho_Chi_Minh" // Đảm bảo chạy đúng múi giờ Việt Nam
});

