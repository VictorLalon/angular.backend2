//getTodo
const { response } = require('express');
const Usuario = require('../models/usuarios');
const Medicos = require('../models/medicos');
const Hospital = require('../models/hospital');

const getTodo = async (req, res = response) => {

    /* const usuario = await Usuario.find()
                                    .populate('usuario','nombre img') */
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, medicos, hospital] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medicos.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospital
    });

}

const getDocumentosColeccion = async (req, res = response) => {


    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data =[];

    switch (tabla) {
        case 'medicos':
            data = await Medicos.find({ nombre: regex })
                                 .populate('usuario', 'nombre img')
                                 .populate('hospital', 'nombre img');

            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                 .populate('usuario', 'nombre img');
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;

        default:
            
            return res.status(400).json({
                ok: false,
                msg: 'La Tabla tiene que ser usuarios/medicos/hospitales'
            });

            
    }
    res.json({
        ok: true,
      resultados:data
    });

}
module.exports = {
    getTodo,
    getDocumentosColeccion
}