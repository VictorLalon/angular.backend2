const { get } = require("../routes/usuarios");
const router = require("../routes/usuarios");
const { response, json } = require('express');

const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJwt } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

   const [usuarios,total] = await Promise.all([
        Usuario
        .find({}, 'nombre email role google img')
        .skip(desde)
        .limit(5),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está Registrado'
            });
        }

        const usuarios = new Usuario(req.body);

        //Encripar contraseña
        const salt = bcrypt.genSaltSync();
        usuarios.password = bcrypt.hashSync(password, salt);
        //Guardar Usuario
        await usuarios.save();
        //Generar el Token
        const token = await generarJwt(usuarios._id);



        res.json({
            ok: true,
            usuarios,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado... Revisar logs'
        });
    }

}
//TODO validad token y comprobar si  esl susario es correcto
const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;


    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'El Usuario no existe'
            });
        }
        //actalizacion
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El Usuario ya existe con ese email'
                });
            }

        }

        campos.email = email;
        const usarioACTUALIZADO = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuarios: usarioACTUALIZADO
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
}

const borrarUusario = async (req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'El Usuario no existe'
            });
        }
        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: "Usuario Eliminado"
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUusario,
}