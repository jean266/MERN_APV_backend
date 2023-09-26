
import express from "express";
import { 
    singIn, 
    profile, 
    comfirm, 
    authenticate, 
    forgotPassword,
    checkToken,
    newPassword,
    updatePerfil,
    updatePassword
} from "../controllers/veterinayController.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();

// URL publicas
router.post("/", singIn);
router.get("/confirmar/:token", comfirm);
router.post("/login", authenticate);
router.post("/olvide-password", forgotPassword);
router.route("/olvide-password/:token").get(checkToken).post(newPassword);

// URL privadas
router.get("/perfil", checkAuth, profile);
router.put("/perfil/:id", checkAuth, updatePerfil);
router.put("/actualizar-password", checkAuth, updatePassword);

export default router;