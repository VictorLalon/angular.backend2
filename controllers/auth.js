const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJwt } = require('../helpers/jwt');
const { googleverify } = require('../helpers/google-verify');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


const mailgun = require("mailgun-js");
const { result } = require('lodash');
const DOMAIN = 'sandboxd540ac84baba48b28f1698b8ade86765.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

const login = async (req, res = response) => {

    const { email, password } = req.body;
    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: ('Email no encontrado')
            });
        }
        // veridicar contraseña
        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validarPassword) {
            return res.status(404).json({
                ok: false,
                msg: ('Contraseña no valida')
            });
        }

        //Generar el Token


        const token = await generarJwt(usuarioDB.id);



        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        })
    }

}

const googleSingIn = async (req, res = response) => {

    const googleToken = req.body.token;
    try {

        const { name, email, picture } = await googleverify(googleToken);

        //usuario Existe

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {

            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }
        else {
            usuario = usuarioDB;
            usuario.google = true;

        }

        //GUARDAR EN BASE DE DATOS
        await usuario.save();

        const token = await generarJwt(usuarioDB.id);


        res.json({
            ok: true,
            token
        });

    } catch (error) {

        res.status(401).json({
            ok: false,
            msg: ' Token no es correcto Comuniquese con el administrador'
        })
    }


}
const renewPassword = async (req, res = response) => {

    const { email } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });
        if (!existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: "No existe Email",
            });
        };
        const token = jwt.sign({ _id: existeEmail._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: '50m' });
        const data = {
            from: 'noreplypassword@hello.com',
            to: email,
            subject: 'Cuenta Restablecer Password',
            html: `<h2>Por favor de click en el siguiente link para reestablecer la contraseña</h2>
            <p>${process.env.CLIENTE_URL}/linkPassword/${token}</p>`
        };
        res.json({

            ok: true,
            msg: 'Revise Su Correo para las Instrucciones de Resstablecimiento de Contraseña',
            token,
            email

        });
        mg.messages().send(data, function (error, body) {
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Contraseña no actualizada Error Al enviar correo",
        });
    }


}



const linkPassword = async (req, res = response) => {

    const { email, resetlink, newpassword } = req.body;

    try {
        if (resetlink) {
            jwt.verify(resetlink, process.env.RESET_PASSWORD_KEY, function (error, decodeData) {
                if (error) {
                    return res.status(401).json({
                        ok: false,
                        msg: "El token a expirado"
                    });
                }
            })
        }

        // await Usuario.findOne({ resetlink }, (err, user) => {
            /*     if (err || user) {
                    return res.status(401).json({
                        ok: false,
                        msg: "Usuario de email no existe con el token"
                    });
                } */
            const usuarioDB = await Usuario.findOne({email});
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El Usuario no existe para cambiar la contraseña'
                });
            }
            id = usuarioDB.id

            console.log(id);
            const salt = bcrypt.genSaltSync();
            contra = bcrypt.hashSync(newpassword, salt);

        
           await  Usuario.findByIdAndUpdate(id, { password: contra, new: true });

            res.json({
                ok: true,
                msg: 'Contraseña Cambiada'
            })




            /*     user = _.extend(user, obj); */

            //Encripar contraseña

            //Guardar Usuario

        // })
        // const usuarios = new Usuario(req.body);
        // await usuarios.save();
        // //Generar el Token */
        // const token = await generarJwt(usuarios._id);


        // res.json({
        //     ok: true,
        //     usuarios,
        //     token

        // });



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Contraseña no actualizada ",
        });
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const token = await generarJwt(uid);

    const usuario = await Usuario.findById(uid);
    res.json({
        ok: true,
        token,
        usuario
    });





}




module.exports = {
    login,
    googleSingIn,
    renewToken,
    renewPassword,
    linkPassword
}