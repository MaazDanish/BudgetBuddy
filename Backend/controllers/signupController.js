const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/signup');

exports.postSignUpUser = async (req, res, next) => {
    try {

        // const { firstName, lastName, email, phoneNumber, password, address } = req.body;
        const { name, email, phoneNumber, password } = req.body;

        const existUser = await User.findOne({ email: email });

        if (existUser !== null) {

            return res.status(409).json({ message: "User already Exist with this email id. Please Log In", success: false })

        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({

            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: hash,

        })

        res.status(200).json(newUser);

    } catch (err) {

        console.log(err);
        res.status(400).json({ success: false, error: err, message: "Unsuccess" })
    }
}

exports.postSignIn = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {

            return res.status(404).json({ success: false, message: "User Not Found." })

        }

        const matchingPassword = await bcrypt.compare(password, user.password)

        if (matchingPassword) {

            const payload = {

                userId: user._id,

            };

            let token = jwt.sign(payload, process.env.SECRET_KEY);

            return res.status(200).json({ success: true, message: 'User LogIn Success', token: token, ispremiumuser: user.ispremiumuser })

        } else {

            return res.status(401).json({ success: false, message: 'Email or Password is incorrect' });

        }

    } catch (err) {

        res.status(500).json({ success: false, message: "Error Occured while verifying user for sign in" })
    }
}



exports.getUserInformation = async (req, res, next) => {
    try {

        if (!req.userID || !req.userID.userId) {

            return res.status(401).json({ success: false, message: 'User ID not found in token' });

        }

        const userId = req.userID.userId;


        const user = await User.findOne({ _id: userId });
        // console.log(user, 'user');

        if (!user) {

            return res.status(404).json({ success: false, message: 'User not found' });

        }

        res.status(200).json({ success: true, message: 'USER FOUND', user });

    } catch (error) {

        res.status(500).json({ success: false, message: 'Error occurred while getting user information' });

    }
};

exports.updateUserInformation = async (req, res, next) => {
    try {
        const id = req.userID.userId;


        const { name, email, phoneNumber } = req.body;

        const user = await User.findOne({ _id: id });


        if (!user) {

            res.status(404).json({ message: 'User not found', success: false })

        }

        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }

        await user.save();

        res.status(200).json({ success: true, message: 'Information Updates Successfully' })

    } catch (err) {
        console.log(err);

        res.status(500).json(err);

    }
}