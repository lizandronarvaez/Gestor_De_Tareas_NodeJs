import passport from "passport";
import passportLocal from "passport-local";
const localStrategy = passportLocal.Strategy
// Modelo que utilizaremos para realizar la autenticacion
import { Usuarios } from '../models/Usuarios.js'
// LocalOptions
const LocalOptions = {
    usernameField: 'email',
    passwordField: 'password'
}
passport.use(
    // Por defecto password espera recibir un usuario y password
    new localStrategy(LocalOptions,
        async (email, password, done) => {
            try {
                // Find email usuario
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        confirmarCuenta: 1
                    }
                })
                // Si no hay usuario
                if (!usuario) {
                    return done(null, false, { message: `El email ${email} no esta registrado` })
                }
                // Email existe pero el password no es correcto
                if (!usuario.comparaPassword(password)) {
                    return done(null, false, {
                        message: 'El password es incorrecto'
                    })
                }
                // El email existe y la password es correcta
                return done(null, usuario)
            } catch (error) {
                // Si el usuario o email no esta registrado o no existe
                return done(null, false, {
                    message: 'El email no existe'
                })
            }
        }
    )
)
// Serializar el usuario
passport.serializeUser((usuario, done) => {
    done(null, usuario)
})
// Deserealizar el usuario
passport.deserializeUser((usuario, done) => {
    done(null, usuario)
})

// Exportamos el modulo
export { passport }