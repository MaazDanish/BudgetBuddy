const express = require('express')

const router = express.Router()

const authenticateToken = require('../Middleware/authentication');

const premiumController = require('../Controller/buypremiumController')

router.get('/buypremium', authenticateToken, premiumController.purchasepremium)

router.post('/updatetransactionstatus', authenticateToken, premiumController.updateTransactionStatus)

router.get('/leaderboard', premiumController.leaderboard);





module.exports = router;