// Configuracion en la definiremos la conexion ala base de datos,credenciales parametros
import { Sequelize } from "sequelize";
import './dotenv.js'
// Configuracion de la base de datos mysql a traves de sequelize
const configDB = new Sequelize(process.env.DB_NAME, process.env.USERNAME, process.env.PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: 0,
  logging: false,
  define: {
    timestamps: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export { configDB };
