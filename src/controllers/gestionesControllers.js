import { Proyectos } from "../models/Proyectos.js";
import { Gestiones } from "../models/Gestiones.js";

const nuevaTarea = async (req, res, next) => {
  // Busca un proyecto
  const BuscarProyecto = await Proyectos.findOne({
    where: { url: req.params.url },
  });
  // Lectura de datos a traves del input
  const { gestiones } = req.body;
  // estado=0 (INCOMPLETO) y id del proyecto
  const estado = 0;
  const proyectoId = BuscarProyecto.id;
  // Insertar en la base de datos
  const resultado = await Gestiones.create({ gestiones, estado, proyectoId });
  if (!resultado) next();
  // Redireccionar
  res.redirect(`/proyecto/${req.params.url}`);
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const gestion = await Gestiones.findOne({ where: { id } });
  let estado = 0;
  if (gestion.estado == estado) {
    gestion.estado = 1;
  } else {
    gestion.estado = estado;
  }
  const resultado = await gestion.save();
  if (!resultado) next();
  res.status(200).send("Actualizado!");
};

const eliminarGestion = async (req, res) => {
  const { id } = req.params
  const resultado = await Gestiones.destroy({ where: { id } })
  if (!resultado) return next()

  res.status(200).send('Gestion eliminada correctamente')
}
export default { nuevaTarea, cambiarEstado, eliminarGestion };
