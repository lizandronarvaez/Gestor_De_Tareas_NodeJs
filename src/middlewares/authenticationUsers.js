import passport from "passport"
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
// Importamos el modelo de usuarios
import { Usuarios } from "../models/Usuarios.js"
import { Sequelize } from "sequelize"
const Op = Sequelize.Op
// Importamos el correo que utilizaremos para enviar el token
import { envioMail } from '../handlers/email.js'
// Si la autenticacion es correcta te redirige a una u otra pagina
// Autenticar con crendenciales a los usuarios
const autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/pagina-principal',
    failureRedirect: '/',
    failureFlash: true,
    badRequestMessage: 'El email y la contraseña son obligatorios'
})
// Comprueba si el usuario esta autenticado para acceder ala ruta
const usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado correctamente, accedera ala ruta
    if (req.isAuthenticated()) return next()
    // Sino esta autenticado se va a redirigir al Form de inicio sesion para que se logee
    return res.redirect('/')

}
// Cierra la sesion del usuario autenticado
const cerrarSesion = (req, res) => {
    // Utilizamos destroy para cerrar sesion
    req.session.destroy(() => {
        // Cuando cerremos sesion, se va a rederidigir a la ruta login
        res.redirect('/')
    })
}
// Reestablecer la contraseña mendiante una autenticacion de token
const sendToken = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email } })
    // Aplicamos un condicional si no existe el correo registrado
    if (!usuario) {
        req.flash('error', 'El email no existe')
        res.redirect('/reestablecer-password')
        // En caso de que si exista generaremos un token
    } else {
        usuario.token = crypto.randomBytes(20).toString('hex')
        usuario.tokenDuration = Date.now() + 1800000
        // Guardamos los token en el usuario
        await usuario.save()
        // Generamos un url para restablecer la contraseña
        const urlPasswordReset = `http://${req.headers.host}/reestablecer-password/${usuario.token}`
        // Y enviar el correo con el correo con el token
        await envioMail({
            usuario: usuario.email,
            subject: 'Reestablecer Password',
            urlPasswordReset,
            archivo: 'reset-password'
        })
        req.flash('correcto', 'Revisa tu correo, para reestablecer la contraseña')
        res.redirect('/')
    }
}
// Valida el token para reestablecer la contraseña
const tokenConfirm = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })
    // Si no se encuentra el token en el usuario se hara esto
    if (!usuario) {
        req.flash('error', 'Token no valido!')
        res.redirect('/reestablecer-password')
        // En caso contrario se podra ejecutar esto
    } else {
        // Formulario actualizar la contraseña
        res.render('nuevaPassword', {
            titlePagina: 'Reestablecer Contraseña'
        })
    }
}

const updatePassword = async (req, res) => {
    // Verifica si el token aun es valido
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            tokenDuration: {
                [Op.gte]: Date.now()
            }
        }
    })
    //En el caso de que no sea valido
    if (!usuario) {
        req.flash('error', 'El tiempo de reestablecer la contraseña expiró')
        res.redirect('/resstablecer-password')
    }
    // Extrae los datos de los input
    const { password, passwordConfirm } = req.body
    // Compara las contraseñas 
    if (password != passwordConfirm) {
        req.flash('error', 'Las contraseñas no coinciden')
        res.render('nuevaPassword', {
            mensajes: req.flash(),
            titlePagina: 'Reestablecer Contraseña'
        })
    } else {
        // Encriptaremos el nuevo password
        const genSaltSync = bcrypt.genSaltSync(10)
        usuario.password = bcrypt.hashSync(password, genSaltSync)
        // Borramos los valores de la solicitud del token
        usuario.token = null
        usuario.tokenDuration = null
        // Guardamos la nueva password encriptada
        usuario.save()
        req.flash('correcto', 'Tu password se ha reestablecido correctamente')
        res.redirect('/')
    }


}
export {
    autenticarUsuario,
    usuarioAutenticado,
    cerrarSesion,
    sendToken,
    tokenConfirm,
    updatePassword
} 