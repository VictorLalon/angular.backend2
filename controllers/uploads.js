const { response } = require("express");
const fs = require('fs')
const path = require ('path');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // Validar tipos de archivos 

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medicos, usuario u hospitales , (tipo)'
        });


    }
    // Validar que existe un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No hay ningun archivo para subir.');
    }
    // Procesar La imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');//cortar el nombre.jpg
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];
    // validar extencion
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        });

    }
    //Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
    //patch para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err){
        console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
    }


    //Actualizar base de datos
    actualizarImagen(tipo,id,nombreArchivo);



    res.json({
        ok: true,
        msg: 'Imagen Subida',
        nombreArchivo
    });
    });


    

}

const retormaImagen = (req,res  = response) =>{

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join (__dirname,`../uploads/${tipo}/${foto}`);

    //imagen por defectos
    if (fs.existsSync(pathImg)){
        res.sendFile(pathImg);
      }  
    else{
        const pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
        res.sendFile(pathImg);
        }


}  

module.exports = {
    fileUpload,
    retormaImagen
}