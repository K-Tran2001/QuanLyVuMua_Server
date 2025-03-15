
const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
// Standard Response Template
const sendResponse = (res, success, data, customData = {}) => {
    res.send({
        success,
        data,
        customdata: {
            items: customData.items || [],
            metadata: customData.metadata || {
                page: 1,
                pagesize: 15,
                totalRecords: 0,
            }
        }
    });
};

// Get All Users
module.exports.getAllUser = async (req, res) => {
    try {
        const users = await userModel.find();
        sendResponse(res, true, users);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Get User By ID
module.exports.getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ msg: 'User not found' });
        }
        sendResponse(res, true, user);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Create or Update User
module.exports.createOrUpdateUser = async (req, res) => {
    try {
        const { id, name, age, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password || '123456', 10);

        const userData = {
            name,
            age,
            username,
            password: hashedPassword,
        };

        let user;
        if (id) {
            // Update User
            user = await userModel.findByIdAndUpdate(id, userData, { new: true });
        } else {
            // Create New User
            user = await userModel.create(userData);
        }

        res.status(201).send(user);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send({
            error: err.message,
            msg: 'Something went wrong',
        });
    }
};

// Delete User
module.exports.deleteUser = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({ msg: 'User not found' });
        }
        sendResponse(res, true, { msg: 'User deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

// Create User
module.exports.createUser = async (req, res) => {
    try {
        const { name, age, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).send({ msg: 'Name, username, and password are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            age,
            username,
            password: hashedPassword,
        });

        res.status(201).send(user);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send({
            error: err.message,
            msg: 'Something went wrong',
        });
    }
};
