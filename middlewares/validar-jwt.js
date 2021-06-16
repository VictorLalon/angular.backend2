const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    //Leer el Token

    const token = req.header('x-token')

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }
    try {

        const { uid } = jwt.verify(token, process.env.JWT_S_T);

        req.uid = uid;
        

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token Incorrecto'
        });
    }
    next();
}

module.exports = {

    validarJWT
}