const Counter=require("../models/counter.js");
const Patient=require("../models/patient.js");
const Medicine=require("../models/medicine.js");
const Prescription=require("../models/prescription.js");
const mongoose = require('mongoose');
const initData=require("./data.js");

const Mongo_URL = 'mongodb://127.0.0.1:27017/Medicine';

main().then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log
});

async function main() {
    await mongoose.connect(Mongo_URL);
}

const reset= async()=>{
    await Counter.deleteMany({});
    await Patient.deleteMany({});
    await Medicine.deleteMany({});
    await Prescription.deleteMany({});
    await Medicine.insertMany(initData.medicines);
    const patientCounter= new Counter({_id: "patientId", sequence_value: 0});
    const prescriptionCounter=new Counter({_id: "prescriptionId", sequence_value: 0})
    await patientCounter.save();
    await prescriptionCounter.save();
    console.log("done");
}

reset();