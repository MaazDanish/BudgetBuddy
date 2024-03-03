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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  }
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;




// const Sequelize = require('sequelize');
// const sequelize = require('../Util/database');

// const forgotPassword = sequelize.define("resetPassword", {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true,
//     },
//     uuid: {
//       type: Sequelize.STRING,
//       allowNull: false,
//     },
//     isActive: {
//       type: Sequelize.BOOLEAN,
//       allowNull: false,
//       defaultValue: 1,
//     },
//   });


module.exports = forgotPassword;