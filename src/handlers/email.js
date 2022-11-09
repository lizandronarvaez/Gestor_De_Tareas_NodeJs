// Importamos las dependecias que necesitaremos
import nodemailer from 'nodemailer'
import pug from 'pug'
import juice from 'juice'
import { convert } from 'html-to-text'
import util from 'util'
import path from "path"
import '../config/dotenv.js'
const __dirname = path.resolve('src');
// Importamos las credenciales
// import dataEmail from '../config/credentialsEmail.js'
// Creamos un transpotador de nodemailer con los datos de configuracion
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT1,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})
// Generamos un Html como respuesta para el cliente
const generarHtml = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/views/emails/${archivo}.pug`, opciones)
    return juice(html)
}
const envioMail = async (opciones) => {
    const html = generarHtml(opciones.archivo, opciones);
    const text = convert(html);
    // Configuracion de la informacion de reeestablecemiento de contraseña
    let configNodeMail =
    {
        from: 'Administrador Gestiones <no-reply@admin-gestiones.com>', // Especicamos de donde se enviara el correo
        to: opciones.usuario, // Lista de los destinatarios
        subject: opciones.subject, // Asunto del mensaje
        text,
        html,
    }
    const enviar = util.promisify(transporter.sendMail, transporter)
    return enviar.call(transporter, configNodeMail)
}

export {
    envioMail
}

