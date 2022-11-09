import axios from "axios";
import Swal from "sweetalert2";
import { estadoProgreso } from "../js/funciones/progreso.js";
const gestiones = document.querySelector(".listado-pendientes");
if (gestiones) {
  gestiones.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-check-circle")) {
      const icon = e.target;
      const idGestion = icon.parentElement.parentElement.dataset.gestion;
      //Enviando la id por url
      const url = `${location.origin}/gestiones/${idGestion}`;
      axios.patch(url, { idGestion }).then((response) => {
        if (response.status === 200) {
          icon.classList.toggle("completo");
          estadoProgreso()
        }
      });
    }
    if (e.target.classList.contains("fa-trash")) {
      const gestionHtml = e.target.parentElement.parentElement,
        idTarea = gestionHtml.dataset.gestion
      // 
      Swal.fire({
        title: "Eliminar esta gestion?",
        text: "Si lo elimina, no podra recuperarlo",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "No, Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar",
      })
        .then((result) => {
          if (result.isConfirmed) {
            const url = `${window.origin}/gestiones/${idTarea}}`
            axios.delete(url, { params: { idTarea } })
              .then((respuesta) => {
                if (respuesta.status === 200) {
                  // Eliminar la gestion del DOM
                  gestionHtml.parentElement.removeChild(gestionHtml)
                  // Crear Swal alerta para confirmar que la tarea se ha eliminado
                  Swal.fire(
                    'Gestion Eliminada',
                    respuesta.data,
                    'success',
                  )
                  estadoProgreso()
                }
              })
          }
        })
    }
  });
}

export default gestiones;
