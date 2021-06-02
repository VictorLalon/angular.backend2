const jwt = require('jsonwebtoken');

const generarJwt = (uid) => {

    return new Promise((resolvem, reject) => {
        const payload = {
            uid,
        };

        jwt.sign(payload, process.env.JWT_S_T, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolvem(token);
            }
        });
    });
}

module.exports ={
    generarJwt,
}