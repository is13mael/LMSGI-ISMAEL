const API = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDE2ZDRjNjExYzU5MDI3YTAyYzViMTI2MTdlMTJiMCIsIm5iZiI6MTc3MzI0MjMyMS4wMjQ5OTk5LCJzdWIiOiI2OWIxODdkMWM3NGU0YjRiNWFkYTY3MjciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0JnpS6ZTNLun1S7vPFylAWSlK9OLbEcRTtybVB2yj-8';
// Fíjate que aquí YA incluyo el /3
const API_URL = 'https://api.themoviedb.org/3'; 
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.getElementById('btn-Buscar');
    if (btnBuscar) btnBuscar.addEventListener('click', buscarPeliculas);

    const btnPopulares = document.getElementById('btn-Populares');
    if (btnPopulares) btnPopulares.addEventListener('click', cargarPopulares);
    
    
    const btnTrending = document.getElementById('btn-Trending');
    if (btnTrending) btnTrending.addEventListener('click', cargarTrending);
    cargarPopulares();
});

function cargarPopulares() {
    console.log("Cargando POPULARES...");
    fetch(`${API_URL}/movie/popular?language=es-ES&page=1`, {
        headers: {
            'Authorization': `Bearer ${API}`,
            'accept': 'application/json'
        }
    })
    .then(res => {
        console.log("Respuesta de POPULARES:", res);
        if(!res.ok) throw new Error("Error en la respuesta");
        return res.json();
    })
    .then(datos => {
        console.log("Datos Populares:", datos);
        verResultados(datos.results, 'resultados');
        activarBoton("btn-Populares");
    })
    .catch(err => console.error("Error en Populares:", err));
}

function cargarTrending() {
    console.log("Cargando TRENDING..."); // ← DEBUG

    fetch(`${API_URL}/trending/movie/day?language=es-ES`, {
        headers: {
            'Authorization': `Bearer ${API}`,
            'accept': 'application/json'
        }
    })
    .then(res => {
        console.log("Respuesta TRENDING:", res);
        return res.json();
    })
    .then(datos => {
        console.log("Datos TRENDING:", datos); 
        verResultados(datos.results, 'resultados');
        activarBoton("btn-Trending");
    })
    .catch(err => console.error("Error en Trending:", err));
}


function buscarPeliculas() {
    const input = document.getElementById('busqueda');
    const texto = input.value.trim();
    if (!texto) return;

    fetch(`${API_URL}/search/movie?query=${encodeURIComponent(texto)}&language=es-ES`, {
        headers: {
            'Authorization': `Bearer ${API}`,
            'accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(datos => verResultados(datos.results, 'resultados'))
    .catch(err => console.error("Error en Búsqueda:", err));
}

async function verResultados(peliculas, contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return;
    contenedor.innerHTML = '';

    for (const peli of peliculas) {
        const div = document.createElement('div');
        div.className = 'pelicula-card';

        const poster = peli.poster_path
            ? `${IMG_URL}${peli.poster_path}`
            : 'https://via.placeholder.com/300x450?text=Sin+Imagen';

        const actores = await obtenerActores(peli.id);
        const nombreActores = actores.map(a => a.name).join(', ') || "Sin datos";

        const trailerKey = await obtenerTrailer(peli.id);
        const año = peli.release_date ? peli.release_date.slice(0, 4) : "N/A";

        div.innerHTML = `
            <img src="${poster}" alt="${peli.title}">
            <h3>${peli.title} (${año})</h3>
            <p>⭐ ${peli.vote_average ? peli.vote_average.toFixed(1) : 'N/A'}</p>
            <p><strong>Actores:</strong> ${nombreActores}</p>
        `;

        contenedor.appendChild(div);
    }
}

function activarBoton(id) {
    document.querySelectorAll("nav a, button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById(id);
    if (btn) btn.classList.add("active");
}

function obtenerActores(idPelicula){
    return fetch(`${API_URL}/movie/${idPelicula}/credits?language=es-ES`, {
        headers: {
            'Authorization': `Bearer ${API}`,
            'accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(datos => datos.cast.slice(0, 3))
    .catch(err => {
        console.error("Error obteniendo actores:", err);
        return[];
    });
}

function obtenerTrailer(idPelicula){
    return fetch(`${API_URL}/movie/${idPelicula}/videos?language=es-ES`, {
        headers: {
            'Authorization': `Bearer ${API}`,
            'accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(datos =>{
        const trailer = datos.results.find(
            v => v.type === "Trailer" && v.site === "YouTube"
        );
        return trailer ? trailer.key:null;
    })
    .catch(err => {
        console.error("Error obteniendo traileres:", err);
        return null;
    });
}