import proyectos from '../modulos/proyectos.js'
import gestiones from '../modulos/gestiones.js'
import { estadoProgreso } from './funciones/progreso.js'
import { horaSistema } from './funciones/reloj.js'
document.addEventListener('DOMContentLoaded', () => {
    estadoProgreso()
    horaSistema()
})