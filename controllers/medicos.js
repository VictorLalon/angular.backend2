const { response, json } = require('express');
const Medico = require('../models/medicos');


const getMedico = async (req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital','nombre img')

    res.json({
        ok: true,
        medicos
    });
}
    const crearMedico = async (req, res = response) => {



        const uid = req.uid;
        const medicos = new Medico({
            usuario: uid,
            ...req.body
        });
        console.log(uid);
        try {


            const medicoDB = await medicos.save();

            res.json({
                ok: true,
                medicos: medicoDB
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Error Inesperado... Comuníquese con el Administrador'
            });
        }
    }
    const actualizarMedico = async (req, res = response) => {



        res.json({
            ok: true,
            msg: 'actualizar médico'
        });
    }
    const borrarMedico = async (req, res = response) => {



        res.json({
            ok: true,
            msg: 'borrar médico'
        });
    }

    module.exports = {
        getMedico, actualizarMedico, crearMedico, borrarMedico
    }