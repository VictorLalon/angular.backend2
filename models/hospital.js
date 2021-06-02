const { Schema, model } = require('mongoose');
 
// CREO EL ESQUEMA PARA MONGO
const HospitalSchema = Schema({
 
    nombre: {
        type: String,
        require: true
    },
    img: {
        type: String
    },
    // Aqui le estoy diciendo a Mongoose que usuario esta relacionado con Hospital
    usuario: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
 
    // Aqui le estoy cambiando el nombre por hospitales a la colecion porque Mongo pone por defecto Hospitals
}, { collection: 'hospitales' });
 
HospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});
 
 
 
module.exports = model('Hospital', HospitalSchema);