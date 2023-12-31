import nodemailer from "nodemailer";

const emailSignUp = async ({email, name, token}) => {
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
    from : "gomezjean266@gmail.com",
    to : email, 
    subject : "Compruba tu cuenta de APV",
    text : "Compruba tu cuenta de APV",
    html : `
        <p>Hola: ${name}, comprueba tu cuenta APV</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a> </p>
        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje </p>
    `
  });

  console.log(info);
};

export default emailSignUp;
