import Swal from "sweetalert2"

export const estadoProgreso = () => {
    // Seleccionamos las tareas existentes
    const gestiones = document.querySelectorAll('li.tarea')
    // Segun la lista de tareas
    if (gestiones.length) {
        // Seleccionamos las tareas completadas
        const gestionesCompletas = document.querySelectorAll('i.completo')
        // Calcular el progreso del avance
        const progreso = Math.round((gestionesCompletas.length / gestiones.length) * 100)

        // Calcular el porcentaje de avance
        const porcentaje = document.querySelector('#porcentaje')
        porcentaje.style.width = `${progreso}%`
        if (progreso == 100) {
            Swal.fire(
                'Completaste el proyecto',
                'Feliciades, haz realizado todas las gestiones',
                'success'
            )
        }
    }

}
