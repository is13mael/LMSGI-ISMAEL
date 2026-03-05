const estado = {
    victorias: 0,
    derrotas: 0,
    empates: 0
};

const Jugadas = [
    "piedra",
    "papel",
    "tijera",
    "lagarto",
    "spock"
];

const emojis = {
    piedra: "🪨",
    papel: "📋",
    tijera: "✂️",
    lagarto: "🦎",
    spock: "🖖"
};

const reglas = {
    piedra: ["tijera", "lagarto"],
    papel: ["piedra", "spock"],
    tijera: ["papel", "lagarto"],
    lagarto: ["spock", "papel"],
    spock: ["piedra", "tijera"]
};

const Mensaje_ganador = {
    piedra_tijera: "La piedra aplasta a la tijera",
    piedra_lagarto: "La piedra aplasta al lagarto",
    papel_piedra: "El papel envuelve a la piedra",
    papel_spock: "El papel desautoriza al Spock",
    tijera_papel: "Las tijeras cortan el papel",
    tijera_lagarto: "Las tijeras decapitan al lagarto",
    lagarto_spock: "El lagarto envenena a Spock",
    lagarto_papel: "El lagarto devora el papel",
    spock_tijera: "El spock rompe las tijeras",
    spock_piedra: "El spock evaporiza a la piedra"
};

const displays = document.querySelectorAll(".display-jugador");
const displayJugador = displays[0];
const displayCPU = displays[1];

const botonesJugadas = document.querySelectorAll(".boton-eleccion-jugada");
const Mensaje_resultado = document.querySelector(".mensaje-resultado");
const contador_victorias = document.getElementById("contador-victorias");
const contador_derrotas = document.getElementById("contador-derrotas");
const contador_empates = document.getElementById("contador-empates");

// ✅ Una sola definición
function reiniciarDisplays() {
    displayJugador.innerHTML = "?";
    displayJugador.classList.remove("mostrar-jugada");

    displayCPU.innerHTML = "?";
    displayCPU.classList.remove("mostrar-jugada");

    Mensaje_resultado.textContent = "Estadísticas del juego";
    Mensaje_resultado.className = "mensaje-resultado";
}

function inicializarJuego() {
    estado.victorias = 0;
    estado.derrotas = 0;
    estado.empates = 0;

    reiniciarDisplays();
    actualizarContadores();

    botonesJugadas.forEach((boton, indice) => {
        boton.addEventListener("click", () => {
            jugar(Jugadas[indice]);
        });
    });
}

function jugar(eleccionUsuario) {
    reiniciarDisplays();

    const eleccionCPU = obtenerEleccionCPU();

    mostrarEleccion(displayJugador, eleccionUsuario);
    mostrarEleccion(displayCPU, eleccionCPU);

    const resultado = calcularResultadoJugada(eleccionUsuario, eleccionCPU);

    mostrarResultadoJugada(resultado, eleccionUsuario, eleccionCPU);
}

function obtenerEleccionCPU() {
    const indice = Math.floor(Math.random() * Jugadas.length);
    return Jugadas[indice];
}

function mostrarEleccion(display, eleccion) {
    display.innerHTML = "";

    const emoji = document.createElement("p");
    emoji.classList.add("icono-jugada");
    emoji.textContent = emojis[eleccion];

    const texto = document.createElement("p");
    texto.classList.add("text");
    texto.textContent = eleccion;

    display.classList.add("mostrar-jugada");
    display.appendChild(emoji);
    display.appendChild(texto);
}

function calcularResultadoJugada(usuario, cpu) {
    if (usuario === cpu) return "empate";
    if (reglas[usuario].includes(cpu)) return "victoria";
    return "derrota";
}

function mostrarResultadoJugada(resultado, usuario, cpu) {
    if (resultado === "victoria") {
        estado.victorias++; 
        const clave = `${usuario}_${cpu}`;
        Mensaje_resultado.textContent = `¡GANASTE! ${Mensaje_ganador[clave]}`;
        Mensaje_resultado.classList.add("victoria");

    } else if (resultado === "derrota") {
        estado.derrotas++; // ✅
        const clave = `${cpu}_${usuario}`;
        Mensaje_resultado.textContent = `¡PERDISTE! ${Mensaje_ganador[clave]}`;
        Mensaje_resultado.classList.add("derrota");

    } else {
        estado.empates++; // ✅
        Mensaje_resultado.textContent = "¡EMPATE! Los dos eligieron lo mismo";
        Mensaje_resultado.classList.add("empate");
    }

    actualizarContadores(); 
}

function actualizarContadores() {
    contador_victorias.textContent = estado.victorias;
    contador_derrotas.textContent = estado.derrotas;
    contador_empates.textContent = estado.empates;
}

function inicializarTooltips() {
    botonesJugadas.forEach((boton, indice) => {
        const jugada = Jugadas[indice];
        const vence = reglas[jugada];

        boton.setAttribute("title", `${jugada} vence a: ${vence.join(" y ")}`);
    });
}

inicializarJuego();
inicializarTooltips();