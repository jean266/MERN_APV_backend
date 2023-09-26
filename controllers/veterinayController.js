
import Veterinary from "../models/Veterinary.js"
import generateJWT from "../helpers/generateJWT.js";
import generateID from "../helpers/generateID.js";
import emailSignUp from "../helpers/emailSignUp.js";
import emailForgotPassword from "../helpers/emailForgotPassword.js";

const singIn = async (req, res) => {
    const { email, name } = req.body;

    // Prevenir usuarios duplicados
    const userExist = await Veterinary.findOne({ email });

    if(userExist) {
        const error = new Error('Usuario ya reguistrado')
        return res.status(400).json({msg: error.message});
    }

    try {
        // Guardar un nuevo veterinario
        const veterinary = new Veterinary(req.body);
        const veterinarySave = await veterinary.save();

        // Enviar el email
        emailSignUp({
            email, 
            name, 
            token : veterinarySave.token
        });

        res.json(veterinarySave);
    } catch (error) {
        console.error(`error : ${error}`);
    }
};

const comfirm = async (req, res) => {
    const { token } = req.params;

    const userComfirm = await Veterinary.findOne({ token });

    if(!userComfirm) {
        const error = new Error("Token no Valido");
        return res.status(404).json({msg: error.message});
    }

    try {
        userComfirm.token = null;
        userComfirm.confirmed = true;
        await userComfirm.save();

        res.json({ msg: "Usuario Confirmado Correctamente" });
    } catch (error) {
        console.error(`error : ${error}`);
    }
};

const authenticate = async (req, res) => {
   const { email, password } = req.body;

   // Comprobar si el usuario existe
   const user = await Veterinary.findOne({email});

   if(!user) {
    const error = new Error("El Usuario no existe");
    return res.status(403).json({ msg : error.message});
   } 

   // Comprobar si el usuario esta confirmado
   if(!user.confirmed) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg : error.message});
   }

   // Comprabar el password
   if( await user.checkPassword(password)) {
    // Autenticar
    res.json({
        _id: user._id,
        name : user.name,
        emial : user.emial,
        token : generateJWT(user.id)
    });
   } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg : error.message});
   }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    
    const veterinary = await Veterinary.findOne({email});

    if(!veterinary) {
        const error = new Error("El usuario no existe");
        return res.status(403).json({ msg : error.message});
    }

    try {
        veterinary.token = generateID();
        await veterinary.save();

        // Enviar email con instrucciones
        emailForgotPassword({
            email,
            name : veterinary.name,
            token : veterinary.token 
        })

        res.json({ msg : "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        console.error(error);
    }
};

const checkToken = async (req, res) => {
    
    const { token } = req.params;

    const tokenValidate = await Veterinary.findOne({ token });

    if(!tokenValidate) {
        // El token no es valido
        const error = new Error("Token no valido");
        return res.status(400).json({ msg : error.message});
    }

    // El token es valido el usuario existe
    res.json({ msg : "Token valido el usuario existe" });
    
};

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinary = await Veterinary.findOne({token});

    if(!veterinary) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg : error.message});
    }

    try {
        veterinary.token = null;
        veterinary.password = password;
        await veterinary.save();
        res.json({ msg : "Password modificado correctamente" });
    } catch (error) {
        console.error(error);
    }
};


const profile = (req, res) => {
    const { veterinary } = req;
    res.json({veterinary});
};

const updatePerfil = async (req, res) => {
    const { id } = req.params;
    const veterinary = await Veterinary.findById(id);

    if(!veterinary) {
        const error = new Error("Hubo un error");
        return res.status(404).json({ msg : error.message });
    }

    const { email } = req.body;
    if( veterinary.email !== req.body.email) {
        const existEmail = await Veterinary.findOne({ email });
        if( existEmail ) {
            const error = new Error("Ese email ya esta en uso");
            return res.status(400).json({ msg : error.message });
        }
    }
    
    try {
        veterinary.name = req.body.name || veterinary.name;
        veterinary.email = req.body.email;
        veterinary.phone = req.body.phone;
        veterinary.web = req.body.web || veterinary.web;

        const veterinaryUpdate = await veterinary.save();
        res.json(veterinaryUpdate);
    } catch (error) {
        console.error(error);
    }
}

const updatePassword = async (req, res) => {
    // Leer los datos
    const { id } = req.veterinary;
    const { pwd_current, pwd_new } = req.body;

    // Comprobar que el veterinario exista
    const veterinary = await Veterinary.findById(id);

    if(!veterinary) {
        const error = new Error("Hubo un error");
        return res.status(404).json({ msg : error.message });
    }

    // Comprobar su password
    if(await veterinary.checkPassword(pwd_current)) {
        // Almacena el nuevo password
        veterinary.password = pwd_new;
        await veterinary.save();

        res.json({
            msg : "Password almacenado correctamente"
        })
    } else {
        const error = new Error("El password actual es incorrecto");
        return res.status(400).json({ msg : error.message });
    }
}

export {
    singIn,
    profile,
    comfirm,
    authenticate,
    forgotPassword,
    checkToken,
    newPassword,
    updatePerfil,
    updatePassword
}