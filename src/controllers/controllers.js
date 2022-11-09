// Dependencias importadas
import { Proyectos } from "../models/Proyectos.js";
import { Gestiones } from "../models/Gestiones.js";
//Controladores de rutas
/**
 * Ruta Principala
 */
const homeHandler = async (req, res) => {
  // Muestra en pantalla el usuario que ha iniciado sesion
  const usuarioAutenticado = res.locals.usuarioActual.nombre
  // muestra en pantalla los proyectos de cada usuario
  const usuarioId = res.locals.usuarioActual.id
  // Busca todos los proyectos creados con cada usuario identificado
  const projectsCreates = await Proyectos.findAll({ where: { usuarioId } });
  // Rendirizamos la vista que queremos ver y las variables a utilizar 
  res.render("index", {
    titlePagina: "Gestiones MVC, Node and Pug",
    projectsCreates,
    usuarioAutenticado
  });
};
/**
 * Ruta proyecto en formulario
 */
const newFormHandler = async (req, res) => {
  const usuarioAutenticado = res.locals.usuarioActual.nombre
  const usuarioId = res.locals.usuarioActual.id
  const projectsCreates = await Proyectos.findAll({ where: { usuarioId } });
  res.render("crearProyecto", {
    titlePagina: "Nueva Gestion",
    infoPagina: "Nueva Gestion",
    projectsCreates,
    usuarioAutenticado
  });
};
/**
 * Crear proyecto metodo POST
 */
const newProjectsHandler = async (req, res) => {
  const usuarioAutenticado = res.locals.usuarioActual.nombre
  const usuarioId = res.locals.usuarioActual.id
  const projectsCreates = await Proyectos.findAll({ where: { usuarioId } });
  const { nombre } = req.body;
  // Validar el formulario si no hay nombre,agregando un errores
  let errores = [];
  if (!nombre)
    errores.push({ texto: "Debes definir un nombre para el proyecto" });
  // Si hay errores en el formulario
  if (errores.length > 0) {
    res.render("crearProyecto", {
      errores,
      projectsCreates,
      usuarioAutenticado
    });
  } else {
    const usuarioId = res.locals.usuarioActual.id
    await Proyectos.create({ nombre, usuarioId });
    res.redirect("/pagina-principal");
  }
};
/**Acceder a cada proyecto segun la URL*/
const urlProjectsHandler = async (req, res, next) => {
  const usuarioAutenticado = res.locals.usuarioActual.nombre
  const usuarioId = res.locals.usuarioActual.id
  const projectsPromise = Proyectos.findAll({ where: { usuarioId } });
  const infoProyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    },
  });
  const [projectsCreates, infoProyecto] = await Promise.all([
    projectsPromise,
    infoProyectoPromise,
  ]);
  // Recopilar tareas de cada proyecto
  const buscarGestiones = await Gestiones.findAll({
    where: { proyectoId: infoProyecto.id },
  });
  if (!infoProyecto) return next();
  // Render ala vista del proyecto
  res.render("gestionesProyecto", {
    titlePagina: "Gestiones ",
    infoPagina: "Gestiones",
    infoProyecto,
    projectsCreates,
    buscarGestiones,
    usuarioAutenticado
  });
};
// Actualizar proyecto
const editProjectsHandler = async (req, res) => {
  const usuarioAutenticado = res.locals.usuarioActual.nombre
  const usuarioId = res.locals.usuarioActual.id
  const projectsPromise = Proyectos.findAll({ where: { usuarioId } });
  const infoProyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    },
  });
  const [projectsCreates, infoProyecto] = await Promise.all([
    projectsPromise,
    infoProyectoPromise,
  ]);
  res.render("crearProyecto", {
    titlePagina: "Editar Gestion",
    infoPagina: "Editar Gestion",
    projectsCreates,
    infoProyecto,
    usuarioAutenticado
  });
};

const updateProjectsHandler = async (req, res) => {
  const usuarioId = res.locals.usuarioActual.id
  const projectsCreates = await Proyectos.findAll({ where: { usuarioId } });
  const { nombre } = req.body;
  let errores = [];
  // Validar el formulario si no hay nombre,agregando un errores
  if (!nombre)
    errores.push({ texto: "Debes definir un nombre para la gestion" });
  // Si hay errores en el formulario
  if (errores.length > 0) {
    res.render("crearProyecto", {
      errores,
      projectsCreates,
    });
  } else {
    await Proyectos.update(
      { nombre: nombre },
      { where: { id: req.params.id } }
    );
    res.redirect("/pagina-principal");
  }
};

// Eliminar un proyecto
const deleteProjectsHandler = async (req, res, next) => {
  const { urlProyecto } = req.query;
  const resultado = await Proyectos.destroy({
    where: { url: urlProyecto },
  });
  if (!resultado) return next();
  res.status(200).send("Gestion eliminada correctamente");
};
// Exportando los controladores de ruta
export default {
  homeHandler,
  newFormHandler,
  newProjectsHandler,
  urlProjectsHandler,
  editProjectsHandler,
  updateProjectsHandler,
  deleteProjectsHandler,
};
