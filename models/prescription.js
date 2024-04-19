const mongoose = require('mongoose');
const { Schema } = mongoose;

const prescriptionSchema=new mongoose.Schema({
    medicines:[
        {
            type: Schema.Types.ObjectId,
            ref: "Medicine",
        }
    ],
    patient:{
        type: Schema.Types.ObjectId,
        ref: "Patient",
    },
    prescriptionId:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})


const Prescription=mongoose.model("Prescription",prescriptionSchema);

module.exports=Prescription;