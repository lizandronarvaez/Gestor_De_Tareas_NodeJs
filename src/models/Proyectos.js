import { Sequelize } from "sequelize";
import { configDB } from "../config/configDB.js";
import slug from "slug";
import shortid from "shortid";

// Configuracion el modelo que queremos que tenga nuestra base de datos
const Proyectos = configDB.define(
  "proyectos",
  {
    id: {
      type: Sequelize.INTEGER(10),
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100),
  },
  {
    hooks: {
      beforeCreate(proyecto) {
        const url = slug(proyecto.nombre).toLowerCase();
        proyecto.url = `${url}-${shortid.generate()}`;
      },
    },
  }
);

export { Proyectos };
