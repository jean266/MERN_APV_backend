
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generateID from "../helpers/generateID.js";

const veterinarySchema = mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim : true
    },
    password: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    phone: {
        type : String,
        default : null,
        trim : true
    },
    web: {
        type : String,
        default : null,
        trim : true
    },
    token: {
        type : String,
        default : generateID()
    },
    confirmed: {
        type : Boolean,
        default : false
    }
});

veterinarySchema.pre("save", async function (next) {
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarySchema.methods.checkPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
}

const Veterinary = mongoose.model("Veterinary", veterinarySchema);
export default Veterinary;