const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {

        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
        }
        
        req.userID = decoded;
        next();
    });
};

module.exports = authenticateToken;
