const jwtHelper = require("../helpers/jwt.helper");
const userModel = require("../models/userModel");
const BaseResponse = require('./BaseResponse'); // Đường dẫn phải đúng
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { default: messaging } = require("./config/firebaseConfig");


const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;


module.exports.Login2 = async (req, res) => {
  const response = new BaseResponse();
    try {
      
      const {usename,password} = req.body;
      //Truy vấn monggo
  

      // Trả về kết quả cho frontend
      res.json({ response });
    } catch (error) {
      response = {
        ...response,
        success:false,
        message:error.toString(),
        data:null
      }
      res.status(500).json(response);
    }
};
module.exports.Login = async (req, res) => {
  const response = new BaseResponse()
  const {username,password} = req.body;
	try {
    const user = await userModel.findOne({username:username})
	  if (!user) {
      response.message = "username không chính xác."
      return res.send(response);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      response.message = "Matah khẩu không chính xác."
      return res.send(response);
    }

    

    const dataForAccessToken = {
      userId: user._id,
      username: user.username,
    };
    const accessToken = await jwtHelper.generateToken(
      dataForAccessToken,
      accessTokenSecret,
      accessTokenLife,
    );
    
    if (!accessToken) {
      return res
        .status(401)
        .send('Đăng nhập không thành công, vui lòng thử lại.');
    }

    let refreshToken =await jwtHelper.generateToken({userId: user._id},refreshTokenSecret,refreshTokenLife); // tạo 1 refresh token ngẫu nhiên

    if (!user.refreshToken || jwtHelper.isRefreshTokenExpired(user.refreshToken,process.env.ACCESS_TOKEN_SECRET)) {
      // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
      //await updateRefreshToken(user.username, refreshToken);
      
      const updatedUser = await userModel.updateOne(
        { username :user.username  },
        { $set: { refreshToken:refreshToken, accessToken:accessToken } }
        );
        
    } else {
      // Nếu user này đã có refresh token thì lấy refresh token đó từ database
      refreshToken = user.refreshToken;
    }
    response.success = true
    response.message='Đăng nhập thành công.'
    response.data = {
      accessToken,
      refreshToken,
      user
    }
    res.json(response);
  } catch (error) {
    response.success = false
    response.message=error.toString()
    res.status(500).json(response);
  }
	
};




module.exports.SignUp = async (req, res) => {
  const response = new BaseResponse();
  try {
    const {username,password, firstName, lastName} = req.body;
  
    const user = await userModel.findOne({username:username});
    
    if (user) {
      response.success = false
      response.message='Tài khoản đã tồn tại.'
      return res.json(response);
    }
    else {
      const hashPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        username,
        password: hashPassword,
        firstName,
        lastName
      };
      const createUser = await userModel.create(newUser);
      if (!createUser) {
        response.success = false
        response.message='Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.'
        return res.json(response);
      }
      response.success = true
      response.data = createUser?._id
      res.json(response);
      
      
    }
  } catch (error) {
    response.success = false
    response.message=error.toString()
    res.status(500).json(response);
  }
  
};

module.exports.ChangePassword = async (req, res) => {
  const response = new BaseResponse;
    try {
      
      const {usename,password} = req.body;
      //Truy vấn monggo
  

      // Trả về kết quả cho frontend
      res.json({ response });
    } catch (error) {
      response = {
        ...response,
        success:false,
        message:error.toString(),
        data:null
      }
      res.status(500).json(response);
    }
};
module.exports.RefreshToken = async (req, res) => {
	const { username, refreshToken } = req.body;
	const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	if (!username || !refreshToken) {
		return res.status(400).json({ message: 'Username và Refresh Token là bắt buộc' });
	}

	// Kiểm tra Refresh Token có hết hạn không
	const expired = isRefreshTokenExpired(refreshToken, process.env.REFRESH_TOKEN_SECRET);

	if (expired) {
		return res.status(401).json({ message: 'Refresh Token đã hết hạn. Vui lòng đăng nhập lại' });
	}

	// Tiến hành làm mới Access Token (nếu Refresh Token hợp lệ)
	try {
		// Tạo Access Token mới
		const newAccessToken = jwt.sign({ username }, accessTokenSecret, accessTokenLife);

		// Tạo Refresh Token mới (nếu cần thiết)
		const newRefreshToken = jwtHelper.generateRefreshToken(32); // Giả sử hàm này đã được định nghĩa

		// Cập nhật Refresh Token mới trong cơ sở dữ liệu (nếu có)
		//await updateRefreshToken(username, newRefreshToken);
		const updatedUser = await userModel.updateOne(
			{ username :user.username  },
			{ $set: { refreshToken:newRefreshToken, accessToken:newAccessToken } }
		  );
		  console.log("updatedUser",updatedUser);

		return res.json({
		accessToken: newAccessToken,
		refreshToken: newRefreshToken,
		});
	} catch (err) {
		return res.status(500).json({ message: 'Lỗi khi làm mới token', error: err.message });
	}
};

// //androi:BHeROs601ml3PM1yI1hxroQXuUG9oT9hi2sxhdjK9xqGD9xQziIadr_hnUk7kOuBGaQiGF8jEzfxF0bL3oj6JU4
// const requestForToken = async () => {
//   try {
//     const token = await getToken(messaging, { vapidKey: "BHeROs601ml3PM1yI1hxroQXuUG9oT9hi2sxhdjK9xqGD9xQziIadr_hnUk7kOuBGaQiGF8jEzfxF0bL3oj6JU4" });
//     if (token) {
//       console.log("FCM Token:", token);
//       return token;
//     } else {
//       console.log("No registration token available.");
//     }
//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//   }
// };





