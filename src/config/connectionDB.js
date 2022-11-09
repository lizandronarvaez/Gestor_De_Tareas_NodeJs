import { configDB } from "./configDB.js";
// Crear la tabla de la base de datos si no existe
import "../models/Proyectos.js";
import "../models/Gestiones.js"
import '../models/Usuarios.js'
// Realizacion la conexion ala base de datos
async function connectionDB() {
  try {
    await configDB.sync()
      .then(() => {
        console.log("Conectado al servidor de la base de datos");
      });
  } catch (error) {
    console.log(error);
  }
}

export { connectionDB };
