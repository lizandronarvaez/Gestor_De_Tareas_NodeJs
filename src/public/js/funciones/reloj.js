const reloj = document.querySelector('.hora')
const fecha = document.querySelector('.fecha')
function horaSistema() {
    const data = new Date()
    // fecha
    fecha.innerHTML = data.toLocaleDateString()
    // hora
    let hora = data.getHours()
    let minutos = data.getMinutes()
    let segundos = data.getSeconds()
    // 
    if (hora < 10) hora = '0' + hora
    if (minutos < 10) minutos = '0' + minutos
    if (segundos < 10) segundos = '0' + segundos
    // 
    if (hora < 12) segundos+=' AM'
    reloj.innerHTML = `${hora}:${minutos}:${segundos}`
}

setInterval(horaSistema, 1000)

export { horaSistema }