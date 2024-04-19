const mongoose = require('mongoose');

const patientSchema=new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    contact:{
        type:Number,
    },
    patientId:{
        type:Number,
        required:true,
    },
    rfid:{
        type:String,
        required:true,
    }
});


const Patient= mongoose.model("Patient",patientSchema);

module.exports=Patient;