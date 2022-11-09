// Importando Dependencias que utilizaremos
import express from "express";
// Instancia de Router Express
const router = express.Router();
// Importando las funciones de controladores de ruta
import controllers from "../controllers/controllers.js";
import gestionesControllers from "../controllers/gestionesControllers.js";
import usuariosControllers from '../controllers/usuariosControllers.js'
import {
  autenticarUsuario,
  usuarioAutenticado,
  cerrarSesion,
  sendToken,
  tokenConfirm,
  updatePassword
} from "../middlewares/authenticationUsers.js";
// Importaciones de validadores de datos que sea limpia
import { validatorInputData } from "../utils/validationData.js";
/**Ruta de los proyectos */
router
  // Ruta Prinpcipal, donde veremos los proyectos creados
  .get("/pagina-principal",
    usuarioAutenticado,
    controllers.homeHandler
  )
  .post('/pagina-principal', usuarioAutenticado, controllers.homeHandler)
  .get("/nuevo-proyecto", usuarioAutenticado, controllers.newFormHandler)
  .post("/nuevo-proyecto", usuarioAutenticado, validatorInputData, controllers.newProjectsHandler)
  // Ruta para acceder a cada proyecto
  .get("/proyecto/:url", usuarioAutenticado, controllers.urlProjectsHandler)
  // Ruta para actualizar un proyecto
  .get("/proyecto/editar/:id", usuarioAutenticado, controllers.editProjectsHandler)
  .post(
    "/nuevo-proyecto/:id",
    usuarioAutenticado,
    validatorInputData,
    controllers.updateProjectsHandler
  )
  // Ruta para eliminar proyecto
  .delete("/proyecto/:url", usuarioAutenticado, controllers.deleteProjectsHandler);

/**Ruta de las gestiones */
router
  // Ruta para agregar tareas
  .post("/proyecto/:url", usuarioAutenticado, gestionesControllers.nuevaTarea)
  // Actualizar una gestion de un proyecto
  .patch("/gestiones/:id", usuarioAutenticado, gestionesControllers.cambiarEstado)
  // Eliminar una gestion de un proyecto
  .delete("/gestiones/:id", usuarioAutenticado, gestionesControllers.eliminarGestion)
/**Ruta de los usuarios */
router
  // Crear una nueva cuenta de usuario para acceder a las gestiones
  .get('/nueva-cuenta', usuariosControllers.nuevaCuenta)
  .get('/verificar-cuenta/:email',usuariosControllers.verificarCuenta)
  .post('/nueva-cuenta', usuariosControllers.crearUsuario)
  // Ruta para iniciar sesion logearse con la credenciales
  .get('/', usuariosControllers.inicioSesion)
  .post('/', autenticarUsuario)
  // Ruta para cerrar la session logeada
  .get('/cerrar-sesion', cerrarSesion)
  // Reestablecer contraseña
  .get('/reestablecer-password', usuariosControllers.reestablecerPassword)
  .post('/reestablecer-password', sendToken)
  .get('/reestablecer-password/:token', tokenConfirm)
  .post('/reestablecer-password/:token', updatePassword)
// Exportando el modulo
export { router };
