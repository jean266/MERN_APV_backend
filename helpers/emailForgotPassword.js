
import nodemailer from "nodemailer";

const emailForgotPassword = async ({email, name, token}) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

    // Enviar el eamil
    const info = await transport.sendMail({
    from : "APV - Administrador de pacientes de veterinaria",
    to : email, 
    subject : "Reestablece tu Password de APV",
    text : "Reestablece tu Password de APV",
    html : `
        <p>Hola: ${name}, has solicitado reestablecer tu password tu cuenta APV</p>
        
        <p>Sigue el siguiente password para generar un nuevo password: 
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>
        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje </p>
    `
    });
}

export default emailForgotPassword;