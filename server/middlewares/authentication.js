// ***********************************
//           Verify Token
// ***********************************

const jwt = require('jsonwebtoken');


let verifyToken = (req, res, next) =>{
    let token = req.get('Authorization');
    let SEED = process.env.SEED_TOKEN;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        // el dato que tenemos en el payload (que viene dentro del decoded) es "user"
        req.user = decoded.user;
        next();
    })  

};


let verifyAdminRole = (req, res, next) =>{
    let user = req.user;

    if (user.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User is not an ADMIN ROLE'
            }
        })
    }

    next();
};

module.exports = {
    verifyToken,
    verifyAdminRole
}