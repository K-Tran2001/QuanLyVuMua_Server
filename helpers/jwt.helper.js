/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/controllers/auth.js
 */
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

/**
 * private function generateToken
 * @param user 
 * @param secretSignature 
 * @param tokenLife 
 */
let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const userData = {
      _id: user._id,
      name: user.name,
      username: user.username,
    }
    // Thực hiện ký và tạo token
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}

/**
 * This module used for verify jwt token
 * @param {*} token 
 * @param {*} secretKey 
 */
let verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}
function generateRefreshToken(dataToken,secret,secret_life) {
  return jwt.sign(dataToken,secret,secret_life);
}

function isRefreshTokenExpired(refreshToken, secret) {
  try {
    const decoded = jwt.verify(refreshToken, secret);
    console.log('Refresh Token hợp lệ:', decoded);
    return false; // Token hợp lệ, chưa hết hạn
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Refresh Token đã hết hạn');
    } else {
      console.log('Token không hợp lệ:', err.message);
    }
    return true; // Token hết hạn hoặc không hợp lệ
  }
}

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
  generateRefreshToken:generateRefreshToken,
  isRefreshTokenExpired:isRefreshTokenExpired
};
