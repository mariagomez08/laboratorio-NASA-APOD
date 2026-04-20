/*LAB: Using NPM - End of module Assessments
Crear una aplicación web interactiva que muestre la "Astronomy Picture of the Day"
(APOD) de la NASA, permitiendo explorar imágenes astronómicas históricas y guardar las
favoritas en el navegador.
La NASA APOD (Astronomy Picture of the Day) es un programa que publica diariamente una
imagen o video astronómico acompañado de una breve explicación científica. Estas
imágenes incluyen fotos de galaxias, nebulosas, planetas y eventos cósmicos, capturadas
por telescopios como el Hubble.
En este laboratorio, usarás la API de la NASA para construir un explorador de APODs con
las siguientes funcionalidades:
1. Obtener y mostrar la "Foto del Día" (APOD)
• Conectar con la API de la NASA para obtener la imagen/video del día actual.
Mostrar en pantalla:
• Título y fecha de la imagen.
• Imagen (o video si aplica).
• Explicación científica proporcionada por la NASA.
2. Selector de fechas
• Añadir un campo de tipo date para que los usuarios puedan buscar APODs de fechas
pasadas.
• Validar que no se ingresen fechas futuras (la NASA no las tiene).
3. Sistema de Favoritos
• Implementar un botón para guardar la APOD actual en favoritos.
• Almacenar los favoritos en localStorage para que persistan al recargar la página.
• Mostrar una lista de favoritos guardados, y al hacer clic en uno, cargar esa APOD
automáticamente.*/
const API_KEY = 'nPGyc47VIhzgfknhAAxk1zmWPbgsvTVHcUOTG8uB';
const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;


const titulo = document.getElementById("titulo");
const imagen = document.getElementById("imagen");
const fecha = document.getElementById("fecha");
const fechaInput = document.getElementById("inputFecha");
const descripcion = document.getElementById("descripcion");
const btnFavorito = document.getElementById("btnFavorito");
const btnBuscarPorFecha = document.getElementById("btnBuscar");

const fechaHoy = new Date().toISOString().split("T")[0];
//max es un atributo HTML del input de tipo date que restringe la fecha máxima que el usuario puede seleccionar
fechaInput.max = fechaHoy;
console.log(fechaHoy)

btnBuscarPorFecha.addEventListener("click", function() {
    titulo.textContent = "CARGANDO TITULO..."
    imagen.textContent = "CARGANDO IMAGEN..."
    fecha.textContent = "CARGANDO FECHA..."
    descripcion.textContent = "CARGANDO DESCRIPCIÓN..."
    validacionFecha();
});

function obtenerDatos() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log(data.date + " es de tipo " + typeof(data.date));
            renderizarDatos(data);
        })
        .catch(error => console.error("El error al conectar es:", error));
}

function filtroPorFecha(fecha){
    const urlConFecha = `${url}&date=${fecha}`;
    fetch(urlConFecha)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderizarDatos(data);
        })
        .catch(error => console.error("El error al filtrar es:", error));
}
function renderizarDatos(data) {
    titulo.innerText = data.title;
    fecha.innerText = data.date;
    descripcion.innerText = data.explanation;
    imagen.src = data.hdurl || data.url;
    imagen.alt = data.title;
}

function validacionFecha(){
    fechaInput.max = fechaHoy;
    if (fechaInput.value !== "" && fechaInput.value <= fechaHoy) {
        filtroPorFecha(fechaInput.value);
    } else {
        return alert("Ingresa una fecha valida!");
    }
}
obtenerDatos();