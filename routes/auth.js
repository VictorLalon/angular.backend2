
/* PATH '/aPP/LOGIN' */
const { Router } = require('express');
const { check } = require('express-validator');
const {login, googleSingIn, renewToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');

const router =Router();

router.post('/', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El rol es obligatorio').not().isEmpty(),
    validarCampos
],
login
)
router.post('/google', [
    check('token', 'El token es obligatorio').not().isEmpty(),
    validarCampos
   
],
googleSingIn
)
router.get('/renew', 
validarJWT,
renewToken
)



module.exports = router;