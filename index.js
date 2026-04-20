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
let elementoFavorito = null;

const fechaHoy = new Date().toISOString().split("T")[0];
fechaInput.max = fechaHoy;
console.log(fechaHoy);

btnBuscarPorFecha.addEventListener("click", function () {
    titulo.textContent = "CARGANDO TITULO...";
    fecha.textContent = "CARGANDO FECHA...";
    descripcion.textContent = "CARGANDO DESCRIPCIÓN...";
    validacionFecha();
});

btnFavorito.addEventListener("click", function () {
    agregarAFavoritos();
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
            console.log(data.date + " es de tipo " + typeof (data.date));
            elementoFavorito = data;
            renderizarDatos(data);
        })
        .catch(error => console.error("El error al conectar es:", error));
}

function filtroPorFecha(fecha) {
    const urlConFecha = `${url}&date=${fecha}`;
    fetch(urlConFecha)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            elementoFavorito = data;
            renderizarDatos(data);
        })
        .catch(error => console.error("El error al filtrar es:", error));
}

function filtroPorFecha(fecha) {
    const urlConFecha = `${url}&date=${fecha}`;
    fetch(urlConFecha)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            elementoFavorito = data;
            renderizarDatos(data);
        })
        .catch(error => console.error("El error al filtrar es:", error));
}
function renderizarDatos(data) {
    titulo.innerText = data.title;
    fecha.innerText = data.date;
    descripcion.innerText = data.explanation;
    imagen.src = "";
    console.log(data.media_type);
    if (data.media_type === "image") {
        imagen.style.display = "block";
        imagen.src = data.hdurl
        imagen.alt = data.title;
    } else {
        imagen.style.display = "none";
        titulo.innerText += " (Video no soportado)";
    }
}

function validacionFecha() {
    fechaInput.max = fechaHoy;
    if (fechaInput.value !== "" && fechaInput.value <= fechaHoy) {
        filtroPorFecha(fechaInput.value);
    } else {
        return alert("Ingresa una fecha valida!");
    }
}

function agregarAFavoritos() {
    if (!elementoFavorito) {
        alert("No hay datos cargados");
        return;
    }

    let favoritos = obtenerFavoritos();

    const existe = favoritos.some(fav => fav.fecha === elementoFavorito.date);

    if (existe) {
        alert("Ya está guardado");
        return;
    }

    const nuevoFavorito = {
        titulo: elementoFavorito.title,
        fecha: elementoFavorito.date,
        descripcion: elementoFavorito.explanation,
        imagen: elementoFavorito.hdurl || elementoFavorito.url
    };

    favoritos.push(nuevoFavorito);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    console.log("Guardado correctamente", favoritos);

    
    renderizarFavoritos();
}

function obtenerFavoritos() {
    try {
        const datos = localStorage.getItem("favoritos");
        if (datos) {
            return JSON.parse(datos);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error leyendo localStorage", error);
        return [];
    }
}

function renderizarFavoritos() {
    const listaFavoritos = document.getElementById("listaFavoritos");
    const favoritos = obtenerFavoritos();

    listaFavoritos.innerHTML = "";

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = "<p style='color:#aaa'>No hay favoritos guardados.</p>";
        return;
    }

    favoritos.forEach(fav => {
        listaFavoritos.innerHTML += `
          <div class="col-md-4">
            <div class="card h-100" style="background-color:#0d0d1a; border:1px solid #2e1e4e;">
              <img src="${fav.imagen}" class="card-img-top" alt="${fav.titulo}" style="max-height:200px; object-fit:cover;">
              <div class="card-body">
                <p style="color:#f0c040; font-size:0.8rem;">${fav.fecha}</p>
                <h6 style="color:#ffffff;">${fav.titulo}</h6>
              </div>
            </div>
          </div>
        `;
    });
}

obtenerDatos();
renderizarFavoritos();