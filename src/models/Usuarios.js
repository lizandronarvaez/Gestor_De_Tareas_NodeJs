import { DATE, Sequelize } from "sequelize";
import { configDB } from "../config/configDB.js";
import { Proyectos } from "./Proyectos.js";
import bcrypt from 'bcryptjs'
// Creamos la tabla usuarios en caso de que no existe
const Usuarios = configDB.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: {
                    msg: 'El nombre de usuario no puede estar vacio'
                }
            }
        },
        unique: {
            arg: true,
            msg: 'El nombre de usuario ya esta en uso'
        }
    },
    email: {
        type: Sequelize.STRING(60),
        // Indicamos aqui que el campo no puede estar vacio al registrarse
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'El email debe ser formato email@'
            },
            notEmpty: {
                msg: 'El campo email debe estar relleno'
            }
        },
        unique: {
            arg: true,
            msg: 'El correo ya esta en uso,introduce otro'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        // Volvemos a indicar que el campo de contraseña debe ir vacio
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El campo password debe estar relleno'
            }
        },
    },
    confirmarCuenta: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    tokenDuration: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            // Antes de crear el usuario, hashearemos el password(Encriptamos la pass del usuario)
            const genSaltSync = bcrypt.genSaltSync(10)
            usuario.password = bcrypt.hashSync(
                usuario.password, genSaltSync
            );
        }
    }
})
// Metodos personalizados
// El problema esta aqui no hace la comparacion de contraseñas
Usuarios.prototype.comparaPassword = function comparaPassword(password) {
    return bcrypt.compareSync(password, this.password)
}
Usuarios.hasMany(Proyectos)
export { Usuarios }