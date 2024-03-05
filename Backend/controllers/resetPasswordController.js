const bcrypt = require('bcrypt');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const sib = require('sib-api-v3-sdk')
const fs = require('fs');
const path = require('path');

const User = require('../models/signup');
const forgotPassword = require('../models/forgotPassword');

exports.forgotPassword = async (req, res, next) => {
    try {
        const email = req.params.email;

        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(401).json({ success: false, message: "User not found" });
        }

        const uuid = uuidv4();

        const forgotPasswordOBJ = {
            userId: user._id,
            isActive: true,
            uuid: uuid
        }

        const forgotPasswordModel = await forgotPassword.create(forgotPasswordOBJ);

        const defaultClient = sib.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const transporter = nodemailer.createTransport(smtpTransport({
            host: process.env.BREVO_HOST,
            port: process.env.BREVO_PORT,
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.PASS_ID
            }

        }))

        const mailOptions = {
            from: process.env.MAIL_ID,
            to: req.params.email,
            text: `Your reset password link is here. Click it to change Password - http://localhost:4444/BudgetBuddy/user/password/reset-password/${uuid} This is valid for one time only.`
        }


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            } else {
                console.log('Email sent', +info.response);
                res.status(200).json({ message: 'A reset password link sent to your email', success: true, })
            }

        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error', success: false, })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {

        const uuidd = req.params.uuidd;

        const result = await forgotPassword.findOne({ uuid: uuidd, isActive: true })

        if (result) {
            fs.readFile(path.join(__dirname, '../', '../frontend/setPassword.html'), 'utf8', (err, html) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('error occured')
                } else {
                    const updatedHtml = html.replace('<%= uuidd %>', uuidd);
                    res.send(updatedHtml)
                }
            })
        } else {
            res.status(404).json({ message: 'Link is not valid', success: false })
        }

    } catch (err) {
        console.log(err);
    }
}

exports.updatingPassword = async (req, res, next) => {
    try {
        const { uuidd, password } = req.body;


        const fp = await forgotPassword.findOne({ uuid: uuidd, isActive: true })

        const userId = fp.userId;

        const user = await User.findOne({ _id: userId })

        await forgotPassword.findOneAndUpdate({ uuidd }, { isActive: false });

        const hash = await bcrypt.hash(password, 10);

        await User.updateOne({ _id: userId }, { password: hash });

        res.status(200).json({ message: 'Your password is successfully changed' })

    } catch (err) {
        console.log(err);
    }
}