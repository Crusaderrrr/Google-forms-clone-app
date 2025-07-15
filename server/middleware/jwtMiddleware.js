const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedPayload) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = decodedPayload; 
        
        next(); 
    });
};

module.exports = jwtMiddleware;