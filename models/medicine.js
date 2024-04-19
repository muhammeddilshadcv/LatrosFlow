const mongoose = require('mongoose');
const { Schema } = mongoose;


const medicineSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    }
});

const Medicine=mongoose.model("Medicine",medicineSchema);

module.exports=Medicine;