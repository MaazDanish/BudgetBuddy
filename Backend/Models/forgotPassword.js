const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  }
});

const ForgotPassword = mongoose.model('forgotpassword', forgotPasswordSchema);

module.exports = ForgotPassword;
