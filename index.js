
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import veterinaryRoutes from "./routes/veterinaryRoutes.js";
import patientRouter from "./routes/patientRouter.js";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

const domainsAllowed = [process.env.FRONTEND_URL];
const corsOptions = {
    origin : function (origin, callback) {
        if(domainsAllowed.indexOf(origin) !== -1) {
            // El origin del Request esta permitido
            callback(null, true);
        } else {
            callback(new Error("No Permitido por CORS"));
        }
    }
}

app.use(cors(corsOptions));

app.use("/api/veterinarios", veterinaryRoutes); 
app.use("/api/pacientes", patientRouter)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor en linea en el puerto ${PORT}`);
});