const express = require('express');

const routes = express.Router();

const signupController = require('../Controller/signupController');
const resetPasswordController = require('../Controller/resetPasswordController');
const authenticateToken = require('../Middleware/authentication');


routes.post('/signup', signupController.postSignUpUser);
routes.post('/signin', signupController.postSignIn);
routes.post('/signInByNumber', signupController.signInByNumber);
routes.get('/getUserInfo', authenticateToken, signupController.getUserInformation)
routes.put('/editUserInfo', authenticateToken, signupController.updateUserInformation);


//  Forgot password routes
routes.get('/password/forgot-password/:email', resetPasswordController.forgotPassword);
routes.get('/password/reset-password/:uuidd', resetPasswordController.resetPassword);
routes.post('/password/updating-password', resetPasswordController.updatingPassword);




module.exports = routes;