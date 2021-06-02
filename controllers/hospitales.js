const { response, json } = require('express');
const { body } = require('express-validator');
const Hospital= require ('../models/hospital');


const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
                                    .populate('usuario','nombre img')

    res.json({
        ok: true,
       hospitales
    });
}

const crearHospitales = async (req, res = response) => {
    
    const uid = req.uid;
    const hospital = new Hospital ({
        usuario:uid,
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

   

    res.json({
        ok: true,
        msg : 'actualizar hospitales'
    });
}
const borrarHospitales = async (req, res = response) => {

   

    res.json({
        ok: true,
        msg : 'borrar hospitales'
    });
}

module.exports={
    getHospitales,
    crearHospitales,
    actualizarrHospitales,
    borrarHospitales
}