const { response, json } = require('express');
const Medico = require('../models/medicos');


const getMedico = async (req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img')

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



    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(400).json({
                ok: false,
                msg: 'El Medico no encontrado por Id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            msg: 'Actualizado Correctamente',
            medico: medicoActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
}
const borrarMedico = async (req, res = response) => {

    const id = req.params.id;
    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(400).json({
                ok: false,
                msg: 'El Medico no encontrado por Id'
            });
        }

        await Medico.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Borrado Correctamente',
            
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
}

module.exports = {
    getMedico, actualizarMedico, crearMedico, borrarMedico
}