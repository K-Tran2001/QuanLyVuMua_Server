const jwtHelper = require("../../helpers/jwt.helper");
const userModel = require("../../models/tmp/userModel");
const bcrypt = require('bcrypt');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

module.exports.register = async (req, res) => {
	const {username, name, age} = req.body;
	console.log("username",username);
	
	const user = await userModel.findOne({username:username});
	console.log(req.body);
	
	if (user) res.status(409).send('Tên tài khoản đã tồn tại.');
	else {
		const hashPassword = bcrypt.hashSync(req.body.password, 10);
		const newUser = {
			username,
			password: hashPassword,
            name,
			age
		};
		const createUser = await userModel.create(newUser);
		if (!createUser) {
			return res
				.status(400)
				.send('Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.');
		}
		return res.send({
			username,
		});
	}
};
module.exports.login = async (req, res) => {
	const username = req.body.username.toLowerCase();
	const password = req.body.password;
    

	const user = await userModel.findOne({username:username})
	if (!user) {
		return res.status(401).send('Tên đăng nhập không tồn tại.');
	}

	const isPasswordValid = bcrypt.compareSync(password, user.password);
	if (!isPasswordValid) {
		return res.status(401).send('Mật khẩu không chính xác.');
	}

	

	const dataForAccessToken = {
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

	let refreshToken = jwtHelper.generateRefreshToken(16); // tạo 1 refresh token ngẫu nhiên
	console.log("isRefreshTokenExpired(user.refreshToken,process.env.ACCESS_TOKEN_SECRET)",jwtHelper.isRefreshTokenExpired(user.refreshToken,process.env.ACCESS_TOKEN_SECRET));
	
	if (!user.refreshToken || jwtHelper.isRefreshTokenExpired(user.refreshToken,process.env.ACCESS_TOKEN_SECRET)) {
		// Nếu user này chưa có refresh token thì lưu refresh token đó vào database
		//await updateRefreshToken(user.username, refreshToken);
		console.log("accessToken",accessToken);
		
		const updatedUser = await userModel.updateOne(
			{ username :user.username  },
			{ $set: { refreshToken:refreshToken, accessToken:accessToken } }
		  );
		  console.log("updatedUser",updatedUser);
		  
	} else {
		// Nếu user này đã có refresh token thì lấy refresh token đó từ database
		refreshToken = user.refreshToken;
	}

	return res.json({
		msg: 'Đăng nhập thành công.',
		accessToken,
		refreshToken,
		user,
	});
};


  
  /**
   * controller refreshToken
   * @param {*} req 
   * @param {*} res 
   */
  module.exports.refreshToken = async (req, res) => {
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
  

