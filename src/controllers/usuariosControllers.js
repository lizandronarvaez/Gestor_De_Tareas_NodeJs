import { Usuarios } from '../models/Usuarios.js'
import { envioMail } from '../handlers/email.js'
// Metodo get para renderizar la vista
const nuevaCuenta = (req, res) => {
    res.render('nuevaCuenta', {
        titlePagina: 'Registrar Usuario'
    })
}
//Metodo post para recibir los datos y crear el usuario
const crearUsuario = async (req, res) => {
    // Recibimos los datos del formulario a traves del POST
    const { nombre, email, password, passwordConfirm } = await req.body
    try {
        // Si no coinciden las contraseñas,no devolvera un error
        if (password !== passwordConfirm) {
            req.flash('error', 'Las contraseñas no coinciden')
            res.render('nuevaCuenta', {
                mensajes: req.flash(),
            })
        } else {
            // Creamos una url para confirmar la cuenta
            const confirmaCuenta = `http://${req.headers.host}/verificar-cuenta/${email}`
            // Creamos un objeto usuario
            const usuario = {
                email
            }
            // Enviar email de confirmacion de cuenta
            await envioMail({
                usuario: usuario.email,
                subject: 'Confirma tu cuenta, por favor',
                confirmaCuenta,
                archivo: 'confirmar-cuenta'
            })
            // En el caso contrario si todos los datos estan correctos creamos la funcion para crear el usuario
            await Usuarios.create({
                nombre,
                email,
                password
            }).then(() => {
                req.flash('correcto', 'Te haz registrado correctamente,se ha enviado un correo para validar tu cuenta')
                res.redirect('/')
            })
        }

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message))
        res.render('nuevaCuenta', {
            mensajes: req.flash(),
            nombre,
            email,
            password
        })
    }
}
// Metodo para iniciar sesion
const inicioSesion = (req, res) => {
    const { error } = res.locals.mensajes
    res.render('inicioSesion', {
        titlePagina: 'Inicio Sesion Usuarios',
        error
    })
}
// Funcion para reestablecer la contraseña
const reestablecerPassword = (req, res) => {
    res.render('reestablecerPassword', {
        titlePagina: 'Reestablecer Password'
    })
}
//Confirmar cuenta de email
const verificarCuenta = async (req, res) => {
    // Cambia el estado de la cuenta
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.email
        }
    })
    if (!usuario) {
        req.flash('error', 'Hubo un error en la validacion de la cuenta')
        res.redirect('/nueva-cuenta')
    } else {
        usuario.confirmarCuenta = 1
        usuario.save()
        req.flash('correcto', 'Tu cuenta se ha validado correctamente')
        res.redirect('/')
    }
}
// Exportando el modulo
export default {
    nuevaCuenta,
    crearUsuario,
    inicioSesion,
    reestablecerPassword,
    verificarCuenta
}