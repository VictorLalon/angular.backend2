const { response, json } = require('express');
const { body } = require('express-validator');
const Hospital = require('../models/hospital');


const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img')

    res.json({
        ok: true,
        hospitales
    });
}

const crearHospitales = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });
    console.log(uid);
    try {


        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado... Comuníquese con el Administrador'
        });
    }



}
const actualizarrHospitales = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: 'El Hospital no existe'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            msg: 'Actualizado Correctamente',
            hospital: hospitalActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
}
const borrarHospitales = async (req, res = response) => {

    const id = req.params.id;

    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                msg: 'El Hospital no existe'
            });
        }

        await Hospital.findByIdAndDelete(id);
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
    getHospitales,
    crearHospitales,
    actualizarrHospitales,
    borrarHospitales
}