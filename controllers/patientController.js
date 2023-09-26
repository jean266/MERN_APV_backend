
import Patient from "../models/Patients.js";

const addPatient = async (req, res) => {
    const patient = new Patient(req.body);
    patient.veterinary = req.veterinary._id;
    
    try {
        const savePatient = await patient.save();
        res.json(savePatient);
    } catch (error) {
        console.error(error);
    }
};

const getPatients = async (req, res) => {
    const patients = await Patient.find().where("veterinary").equals(req.veterinary);
    res.json(patients);
};

const getPatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if(!patient) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg : error.message });
    }
    
    if(patient.veterinary._id.toString() !== req.veterinary._id.toString()) {
        return res.json({ msg : "Accion no Valida" });
    }

    res.json(patient);
    
}

const editPatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if(!patient) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg : error.message });
    }
    
    if(patient.veterinary._id.toString() !== req.veterinary._id.toString()) {
        return res.json({ msg : "Accion no Valida" });
    }

    // Actualizar pacinete
    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.simptoms = req.body.simptoms || patient.simptoms;
    try {
        const pacineteUpdate = await patient.save();
        res.json(pacineteUpdate);
    } catch (error) {
        console.error(error);
    }
}

const deletePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if(!patient) {
        const error = new Error("No encontrado");
        return res.status(404).json({ msg : error.message });
    }
    
    if(patient.veterinary._id.toString() !== req.veterinary._id.toString()) {
        return res.json({ msg : "Accion no Valida" });
    }

    // Elimina un registro
    try {
        await patient.deleteOne(patient);
        res.json({ msg : "Paciente eliminado"} );
    } catch (error) {
        console.error(error);
    }
}


export {
    addPatient,
    getPatients,
    getPatient,
    editPatient,
    deletePatient
}
