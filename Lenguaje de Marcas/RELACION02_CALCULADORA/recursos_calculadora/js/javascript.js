// Variables globales
let numeroActual = '0';
let numeroAnterior = null;
let operadorActual = null;
let resultadoMostrado = false;

/**
 * @brief Ejecuta la inicialización de la calculadora una vez que el DOM está completamente cargado.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Botones numéricos
    document.querySelectorAll('.numero').forEach(boton => {
        boton.addEventListener('click', () => {
            mostrarNumeroPantalla(boton.textContent.trim());
        });
    });
    
    // Botón punto decimal
    document.getElementById('punto').addEventListener('click', () => {
        mostrarPuntoPantalla();
    });
    
    // Botones de operadores
    document.getElementById('sumar').addEventListener('click', () => {
        manejarOperador('+');
    });
    
    document.getElementById('restar').addEventListener('click', () => {
        manejarOperador('-');
    });
    
    document.getElementById('multiplicar').addEventListener('click', () => {
        manejarOperador('×');
    });
    
    document.getElementById('dividir').addEventListener('click', () => {
        manejarOperador('/');
    });
    
    // Botón igual - VERIFICAR QUE ESTO SE EJECUTE
    const botonIgual = document.getElementById('igual');
    if (botonIgual) {
        botonIgual.addEventListener('click', () => {
            console.log('Botón igual presionado'); // Debug
            calcularOperacion();
        });
    } else {
        console.error('No se encontró el botón igual');
    }
    
    // Botón CE (borrar entrada)
    document.getElementById('borrar-entrada').addEventListener('click', () => {
        borrarEntrada();
    });
    
    // Botón C (borrar todo)
    document.getElementById('borrar-todo').addEventListener('click', () => {
        borrarTodo();
    });
    
    // Botón retroceder
    document.getElementById('retroceso').addEventListener('click', () => {
        retroceder();
    });
    
    // Botones de operaciones inmediatas
    document.getElementById('inversa').addEventListener('click', () => {
        operacionInmediata('inverso');
    });
    
    document.getElementById('cuadrado').addEventListener('click', () => {
        operacionInmediata('cuadrado');
    });
    
    document.getElementById('raiz').addEventListener('click', () => {
        operacionInmediata('raiz');
    });
    
    // Actualizar pantalla inicial
    actualizarPantalla();
});

/**
 * @brief Deshabilita el botón del punto decimal en la calculadora.
 */
function deshabilitarPunto(){ 
    const botonPunto = document.getElementById('punto');
    botonPunto.disabled = true;
    botonPunto.classList.add('deshabilitado');
}

/**
 * @brief Habilita nuevamente el botón del punto decimal en la calculadora.
 */
function habilitarPunto(){ 
    const botonPunto = document.getElementById('punto');
    botonPunto.disabled = false;
    botonPunto.classList.remove('deshabilitado');
}

/**
 * @brief Actualiza el contenido mostrado en la pantalla de la calculadora.
 */
function actualizarPantalla() {
    const pantalla = document.getElementById('pantalla');
    let valorMostrar = numeroActual;
    
    // Si el número supera los 12 caracteres o no es finito
    if (valorMostrar.length > 12 || !isFinite(parseFloat(valorMostrar))) {
        let numero = parseFloat(valorMostrar);
        
        if (!isFinite(numero)) {
            valorMostrar = 'Error';
        } else {
            // Redondear a 12 dígitos significativos
            valorMostrar = numero.toPrecision(12);
            
            // Convertir a número para eliminar notación científica si es posible
            let numeroRedondeado = parseFloat(valorMostrar);
            
            // Si es un número entero, eliminar la parte decimal
            if (Number.isInteger(numeroRedondeado)) {
                valorMostrar = numeroRedondeado.toString();
            } else {
                // Eliminar ceros innecesarios al final
                valorMostrar = numeroRedondeado.toString();
            }
        }
    }
    
    pantalla.textContent = valorMostrar;
}

/**
 * @brief Muestra un número en la pantalla gestionando correctamente la entrada.
 */
function mostrarNumeroPantalla(numero) { 
    if (resultadoMostrado) {
        numeroActual = numero;
        resultadoMostrado = false;
        habilitarPunto();
        pantallaColorNormal();
    } else if (numeroActual === '0') {
        numeroActual = numero;
    } else {
        numeroActual += numero;
    }
    
    actualizarPantalla();
}

/**
 * @brief Agrega un punto decimal a la pantalla de la calculadora.
 */
function mostrarPuntoPantalla() { 
    if (resultadoMostrado) {
        numeroActual = '0.';
        resultadoMostrado = false;
        pantallaColorNormal();
    } else if (!numeroActual.includes('.')) {
        numeroActual += '.';
    }
    
    deshabilitarPunto();
    actualizarPantalla();
}

/**
 * @brief Gestiona de forma correcta la operación matemática que hemos seleccionado.
 */
function manejarOperador(operador) { 
    // Si hay una operación pendiente y no se ha mostrado resultado, calcular primero
    if (operadorActual !== null && !resultadoMostrado) {
        calcularOperacion();
    }
    
    numeroAnterior = parseFloat(numeroActual);
    operadorActual = operador;
    resultadoMostrado = true;
    habilitarPunto();
}

/**
 * @brief Realiza la operación matemática indicada por el operador almacenado.
 */
function calcularOperacion() { 
    console.log('Calculando operación:', numeroAnterior, operadorActual, numeroActual); // Debug
    
    if (operadorActual === null || numeroAnterior === null) {
        console.log('No hay operación pendiente'); // Debug
        return;
    }
    
    const num1 = numeroAnterior;
    const num2 = parseFloat(numeroActual);
    let resultado;
    
    console.log('num1:', num1, 'num2:', num2); // Debug
    
    switch (operadorActual) {
        case '+':
            resultado = num1 + num2;
            break;
        case '-':
            resultado = num1 - num2;
            break;
        case '×':
            resultado = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                numeroActual = 'Error';
                actualizarPantalla();
                aplicarColorResultado('/');
                operadorActual = null;
                numeroAnterior = null;
                resultadoMostrado = true;
                return;
            }
            resultado = num1 / num2;
            break;
        default:
            return;
    }
    
    console.log('Resultado:', resultado); // Debug
    
    numeroActual = resultado.toString();
    aplicarColorResultado(operadorActual);
    operadorActual = null;
    numeroAnterior = null;
    resultadoMostrado = true;
    actualizarPantalla();
}

/**
 * @brief Restaura el color por defecto de la pantalla de la calculadora.
 */
function pantallaColorNormal() { 
    const pantalla = document.getElementById('pantalla');
    pantalla.className = 'pantalla color-normal';
}

/**
 * @brief Borra el número introducido actualmente en la pantalla.
 */
function borrarEntrada() { 
    numeroActual = '0';
    resultadoMostrado = false;
    habilitarPunto();
    actualizarPantalla();
    pantallaColorNormal();
}

/**
 * @brief Restablece completamente la calculadora a su estado inicial.
 */
function borrarTodo() { 
    numeroActual = '0';
    numeroAnterior = null;
    operadorActual = null;
    resultadoMostrado = false;
    habilitarPunto();
    pantallaColorNormal();
    actualizarPantalla();
}

/**
 * @brief Elimina el último carácter del número mostrado en pantalla.
 */
function retroceder() { 
    if (resultadoMostrado) {
        numeroActual = '0';
        resultadoMostrado = false;
        habilitarPunto();
        pantallaColorNormal();
    } else {
        // Si se elimina un punto decimal, habilitarlo
        if (numeroActual.endsWith('.')) {
            habilitarPunto();
        }
        
        numeroActual = numeroActual.slice(0, -1);
        
        // Si queda vacío, poner 0
        if (numeroActual === '' || numeroActual === '-') {
            numeroActual = '0';
        }
        
        // Si ya no hay punto, habilitar el botón
        if (!numeroActual.includes('.')) {
            habilitarPunto();
        }
    }
    
    actualizarPantalla();
}

/**
 * @brief Realiza operaciones inmediatas sobre el número mostrado.
 */
function operacionInmediata(operacion) { 
    const numero = parseFloat(numeroActual);
    let resultado;
    
    switch (operacion) {
        case 'inverso':
            if (numero === 0) {
                numeroActual = 'Error';
                actualizarPantalla();
                aplicarColorResultado('inverso');
                resultadoMostrado = true;
                return;
            }
            resultado = 1 / numero;
            break;
            
        case 'cuadrado':
            resultado = numero * numero;
            break;
            
        case 'raiz':
            if (numero < 0) {
                numeroActual = 'Error';
                actualizarPantalla();
                aplicarColorResultado('raiz');
                resultadoMostrado = true;
                return;
            }
            resultado = Math.sqrt(numero);
            break;
            
        default:
            return;
    }
    
    numeroActual = resultado.toString();
    aplicarColorResultado(operacion);
    resultadoMostrado = true;
    actualizarPantalla();
}

/**
 * @brief Aplica un color específico a la pantalla según la operación realizada.
 */
function aplicarColorResultado(operador) { 
    const pantalla = document.getElementById('pantalla');
    pantalla.className = 'pantalla';
    
    switch (operador) {
        case '+':
            pantalla.classList.add('resultado-suma');
            break;
        case '-':
            pantalla.classList.add('resultado-resta');
            break;
        case '×':
            pantalla.classList.add('resultado-multiplicacion');
            break;
        case '/':
            pantalla.classList.add('resultado-division');
            break;
        case 'inverso':
            pantalla.classList.add('resultado-inverso');
            break;
        case 'cuadrado':
            pantalla.classList.add('resultado-cuadrado');
            break;
        case 'raiz':
            pantalla.classList.add('resultado-raiz');
            break;
    }
}