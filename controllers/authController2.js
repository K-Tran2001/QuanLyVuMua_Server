const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const userModel = require("../models/userModel"); // Giả sử bạn có model User
const dotenv = require("dotenv");
const BaseResponse = require("./BaseResponse");
dotenv.config();

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const GenerateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, username: user.username,fullName : user.firstName + " " + user.lastName },
        accessTokenSecret,
        { expiresIn: accessTokenLife }
    );
    
    const refreshToken = jwt.sign(
        { id: user._id },
        refreshTokenSecret,
        { expiresIn: refreshTokenLife }
    );
    
    return { accessToken, refreshToken };
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
  

exports.Login = async (req, res) => {
    const response = new BaseResponse()
    try {
        const { username, password } = req.body;
        const user = await userModel.findOne({ username });
        if (!user){
            response.message = "Invalid username or password"
            return res.status(401).json(response);
        } 
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            response.message = "Invalid username or password"
            return res.status(401).json(response);
        }
        
        const { accessToken, refreshToken } = GenerateTokens(user);
         const updatedUser = await userModel.updateOne(
            { username :user.username  },
            { $set: { refreshToken:refreshToken, accessToken:accessToken } }
          );
        
        response.success = true
        response.message='Đăng nhập thành công.'
        response.data = {
        accessToken,
        refreshToken,
        //user
        }
        res.json(response);
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

exports.RefreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "No refresh token provided" });

    jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid refresh token" });
        
        const newAccessToken = jwt.sign(
            { id: decoded.id },
            accessTokenSecret,
            { expiresIn: accessTokenLife }
        );
        
        res.json({ accessToken: newAccessToken });
    });
};

exports.Logout = (req, res) => {
    res.json({ message: "Logged out successfully" }); // Xử lý logout nếu cần
};

exports.VerifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ error: "No token provided" });

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = decoded;
        next();
    });
};
