import { Sequelize } from "sequelize";
import { configDB } from "../config/configDB.js";
import { Proyectos } from "./Proyectos.js";
const Gestiones = configDB.define("gestiones", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  gestiones: Sequelize.STRING(100),
  
  estado: Sequelize.INTEGER(1),
});
// Creando una llave foranea para que exista una relacion entre las tablas
Gestiones.belongsTo(Proyectos);
export { Gestiones };
