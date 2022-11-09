import Swal from "sweetalert2";
import axios from "axios";

const buttonDelete = document.getElementById("eliminar-proyecto");
if (buttonDelete) {
  buttonDelete.addEventListener("click", (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    Swal.fire({
      title: "Desea eliminar este proyecto?",
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
          const url = `${location.origin}/proyecto/${urlProyecto}`;
          axios.delete(url, { params: { urlProyecto } }).then((res) => {
            Swal.fire("Proyecto eliminado", res.data, "success");
            setTimeout(() => {
              window.location.href = "/pagina-principal";
            }, 3000);
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "No se pudo eliminar el proyecto",
        });
      });
  });
}

export { buttonDelete };
