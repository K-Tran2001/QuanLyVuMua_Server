 const cron = require("node-cron");
const { sendPushFCMNotification } = require("./sendNotify");
const { GetTodayEvents } = require("../controllers/eventController");



const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const dayAfterTomorrow = new Date(tomorrow);
dayAfterTomorrow.setDate(tomorrow.getDate() + 1);



// Lên lịch gửi notify nhắc 20h , thông báo trước 1 ngày
cron.schedule("0 20 * * *", async()=>{
    console.log("send notify 20:00");
    
    const response =await GetTodayEvents(tomorrow, dayAfterTomorrow)
    console.log("response",response);
    
    if(response.success){
        response.data.map(itemEvent =>{
            sendPushFCMNotification("fMyL2hgFS2yL49x5MsQKPA:APA91bEKyrmA3NFgiDq9X4Jckqm1esbhR1A00JbaEeQKkWC2ov5e7ULcjG0GuDtblKMgojnmV6ciioh29JXYY0yRC4U-8hGIpYXzNmVzqHrw0FJT7hjwtvE","Thông báo mới",itemEvent.title)
        })
    }
    
    
}, {
    timezone: "Asia/Ho_Chi_Minh"
});

// Lên lịch gửi notify vào 6h sáng mỗi ngày
cron.schedule("0 6 * * *", async()=>{
    console.log("send notify 6:00");
    
    const response =await GetTodayEvents(today, tomorrow)
    console.log("response",response);
    
    if(response.success){
        response.data.map(itemEvent =>{
            sendPushFCMNotification("fMyL2hgFS2yL49x5MsQKPA:APA91bEKyrmA3NFgiDq9X4Jckqm1esbhR1A00JbaEeQKkWC2ov5e7ULcjG0GuDtblKMgojnmV6ciioh29JXYY0yRC4U-8hGIpYXzNmVzqHrw0FJT7hjwtvE","Thông báo mới",itemEvent.title)
        })
    }
    
    
}, {
    timezone: "Asia/Ho_Chi_Minh"
});

