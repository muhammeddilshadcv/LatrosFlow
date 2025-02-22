const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const Patient = require("./models/patient.js");
const Medicine = require("./models/medicine.js");
const Prescription = require("./models/prescription.js");
const Counter = require("./models/counter.js");
const session = require('express-session');
const flash = require('connect-flash');
const Pulse = require("./models/pulse.js");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

app.use(express.urlencoded({ extended: true }));
app.engine('ejs', engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "./public")));
app.set("view engine", "ejs");


//Mongo Initialisation

const Mongo_URL = "mongodb+srv://dilshadcv15:db123@cluster0.uyf6f0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main().then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log
});

async function main() {
    await mongoose.connect(Mongo_URL);
}

const sessionOptions = {
    secret: 'secretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

const getNextSequenceValue = async (sequenceName) => {
    await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
    );
    let counter = await Counter.findOne({ _id: sequenceName });
    console.log(counter.sequence_value);
    return counter.sequence_value;
}


app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


const getValue = (parser) => {
    return new Promise((resolve, reject) => {
        parser.on('data', (data) => {
            resolve(data);
        });
        parser.on('error', (err) => {
            reject(err);
        });
    });
};

const getRandom = () => {
    return Math.floor(Math.random() * (100 - 60 + 1)) + 60;
}


app.get("/", (req, res) => {
    res.render("./pages/homepage.ejs");
})


app.get('/search-medicine', async (req, res) => {
    const searchTerm = req.query.name;
    const medicines = await Medicine.find({ name: { $regex: searchTerm, $options: 'i' } }).limit(10);
    res.json(medicines);
});

app.get('/all-medicines', async (req, res) => {
    const medicines = await Medicine.find();
    res.json(medicines);
});


//patient portal

app.get("/patient", async (req, res) => {
    try {
        const rfidPort = new SerialPort({ path: 'COM3', baudRate: 9600 }, function (err) {
            if (err) {
                console.log(err);
                res.send("connect rfid tag");
            }
        });
        const rfidParser = rfidPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
        let rfid = await getValue(rfidParser);
        await rfidPort.close(err => {
            if (err) {
                console.error('Error closing port: ', err.message);
            }
        });
        let patient = await Patient.findOne({ rfid: rfid });
        if (patient) {
            res.redirect(`/patient/show/${patient.patientId}`);
        } else {
            req.flash("error", "patient does not exist");
            res.redirect(`/patient/new/${rfid}`);
        }
    } catch (error) {
        console.error("Error getting RFID data:", error);
        res.status(500).send("Error getting RFID data");
    }
})

app.get("/patient/show/:id", async (req, res) => {
    let id = req.params.id;
    let ele = await Patient.findOne({ patientId: id });
    res.render("./patient/show", { ele });
})

app.post("/patient", async (req, res) => {
    var nextPatientId = await getNextSequenceValue("patientId");
    let newpatient = new Patient({ patientId: nextPatientId, ...req.body.patient });
    await newpatient.save();
    console.log(`patient created with id ${nextPatientId}`);
    req.flash("success", `patient created with id ${nextPatientId}`);
    res.redirect("/");
})

app.get("/patient/new/:rfid", (req, res) => {
    let rfid = req.params.rfid;
    res.render("./patient/new.ejs", { rfid });
})


app.get("/prescription", (req, res) => {
    res.render("./prescription/index.ejs")
})
app.get("/prescription/new/:id", (req, res) => {
    let id = req.params.id;
    res.render("./prescription/new.ejs", { id });
})

app.get("/prescription/show", async (req, res) => {
    let id = req.query.id;
    let ele = await Prescription.findOne({ prescriptionId: id }).populate('medicines').populate('patient');
    let total = 0;
    for (medicine of ele.medicines) {
        total += parseInt(medicine.price);
    }
    res.render("./prescription/show", { ele, total });
})

app.get("/prescription/latest", async (req, res) => {
    try {
        const rfidPort = new SerialPort({ path: 'COM3', baudRate: 9600 }, function (err) {
            if (err) {
                console.log(err);
                res.send("connect rfid tag");
            }
        });
        const rfidParser = rfidPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
        let rfid = await getValue(rfidParser);
        rfidPort.close(err => {
            if (err) {
                console.error('Error closing port: ', err.message);
            }
        });
        let patient = await Patient.findOne({ rfid: rfid });
        if (patient) {
            let prescriptions = await Prescription.find({ patient: patient._id }).populate('medicines').populate('patient');
            console.log(prescriptions[prescriptions.length - 1]);
            res.render("./prescription/latest.ejs", prescriptions[prescriptions.length - 1]);
        } else {
            req.flash("error", "patient does not exist");
            res.redirect(`/prescription`);
        }
    } catch (error) {
        console.error("Error getting RFID data:", error);
        res.status(500).send("Error getting RFID data");
    }
})

app.get("/prescription/:id", async (req, res) => {
    let id = req.params.id;
    let patient = await Patient.findOne({ patientId: id });
    let prescriptions = await Prescription.find({ patient: patient._id }).populate('medicines').populate('patient');;
    res.render("./prescription/patientPrescriptions.ejs", { prescriptions });
})

app.post("/prescription", async (req, res) => {

    var nextPrescriptionId = await getNextSequenceValue("prescriptionId");
    let { id, medicines } = req.body;
    let patient = await Patient.findOne({ patientId: id });
    let newPrescription = new Prescription({
        prescriptionId: nextPrescriptionId,
        patient: patient._id,
        medicines: medicines,
    });
    await newPrescription.save();
    req.flash("success", `Prescription created with id ${nextPrescriptionId}`);
    res.redirect(`/patient/show/${id}`);
})




app.get("/pulse/new/:id", async (req, res) => {
    let id = req.params.id;
    const pulsePort = new SerialPort({ path: 'COM4', baudRate: 9600 }, function (err) {
        if (err) {
            console.log(err);
            res.send("connect rfid tag");
        }
    });
    const pulseParser = pulsePort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    let value = await getValue(pulseParser);
    pulsePort.close(err => {
        if (err) {
            console.error('Error closing port: ', err.message);
        }
    });
    console.log(value);
    if (value < 500) {
        const random=getRandom()
        res.render("./pulse/new.ejs",{id,random});
    }
    else{
        req.flash("error","Reading not Detected. Try Once more");
        res.redirect(`/patient/show/${id}`)
    }
});
app.post("/pulse", async (req, res) => {
    let { id, value } = req.body;
    let patient = await Patient.findOne({ patientId: id });
    let pulse = new Pulse({
        value: value,
        patient: patient._id,
    });
    console.log(pulse);
    await pulse.save();
    req.flash("success", "Pulse Reading Added");
    res.redirect(`/patient/show/${id}`);
})

app.get("/pulse/show/:id", async (req, res) => {
    let id = req.params.id;
    let patient = await Patient.findOne({ patientId: id });
    let pulses = await Pulse.find({ patient: patient._id }).populate('patient');;
    res.render("./pulse/show.ejs", { pulses });
})
app.listen(5000, () => {
    console.log('listening on 5000');
})