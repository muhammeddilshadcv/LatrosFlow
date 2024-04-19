const mongoose = require('mongoose');
const { Schema } = mongoose;

const pulseSchema= new mongoose.Schema({
    value:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    patient:{
        type: Schema.Types.ObjectId,
        ref: "Patient",
    }
})

const Pulse=mongoose.model("Pulse",pulseSchema);

module.exports=Pulse;