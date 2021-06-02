const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJwt } = require('../helpers/jwt');
const { googleverify } = require('../helpers/google-verify');
const usuarios = require('../models/usuarios');


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
        const validarPassword = bcrypt.compareSync(password,usuarioDB.password);

        if(!validarPassword){
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

const googleSingIn = async(req,res =response)=>{

    const googleToken = req.body.token;
    try {

        const {name ,email ,picture} = await googleverify (googleToken);

        //usuario Existe

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if (!usuarioDB){

            usuario = new Usuario({
                nombre : name,
                email,
                password: '@@@',
                img: picture,
                google : true
            });
        }
        else {
                usuario=usuarioDB;
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
module.exports = {
    login,
    googleSingIn
}