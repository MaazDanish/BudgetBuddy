const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    // console.log('Auth start');
    // console.log(token);
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            // console.error('Error verifying token:', err);
            return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
        }
        
        // console.log('Decoded Payload:', decoded);
        
        // if (!decoded || !decoded.userId) {
        //     return res.status(401).json({ success: false, message: 'Invalid token format' });
        // }
        // console.log(decoded);
        req.userID = decoded;
        // console.log(req.userID);
        // console.log('Auth end');
        next();
    });
};

module.exports = authenticateToken;



// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const token = req.headers.authorization;

//     jwt.verify(token,process.env.SECRET_KEY,(err,encrypt) => {
//         if(err){
//             res.status(500).json({success:false});
//         }
//         req.userID = encrypt;
//         next();
//     })
// };

// module.exports = authenticateToken;