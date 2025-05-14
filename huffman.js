class Nodo {
    constructor(simbolo, frecuencia) {
        this.simbolo = simbolo;  // Símbolo (ej: 'A')
        this.frecuencia = frecuencia; // Frecuencia del símbolo
        this.izquierda = null;   // Hijo izquierdo
        this.derecha = null;     // Hijo derecho
    }
}

// Evento al hacer clic en el botón
document.getElementById('boton-huffman').addEventListener('click', procesarHuffman);

function procesarHuffman() {
    const input = document.getElementById('subir-txt');
    const archivo = input.files[0];

    if (!archivo) {
        alert("¡Selecciona un archivo primero!");
        return;
    }

    const lector = new FileReader();
    lector.onload = function(e) {
        const texto = e.target.result;
        const frecuencias = calcularFrecuencias(texto);
        const arbolHuffman = construirArbolHuffman(frecuencias);
        const codigos = generarCodigosHuffman(arbolHuffman);
        const textoComprimido = comprimirTexto(texto, codigos);
        
        // Mostrar resultados en el HTML
        document.getElementById('frecuencias').textContent = JSON.stringify(frecuencias, null, 2);
        document.getElementById('codigos').textContent = JSON.stringify(codigos, null, 2);
        document.getElementById('comprimido').textContent = textoComprimido;
    };
    lector.readAsText(archivo);
}

// Paso 1: Contar frecuencia de cada símbolo
function calcularFrecuencias(texto) {
    const frecuencias = {};
    for (const caracter of texto) {
        frecuencias[caracter] = (frecuencias[caracter] || 0) + 1;
    }
    return frecuencias;
}

// Pasos 2-4: Construir el árbol de Huffman
function construirArbolHuffman(frecuencias) {
    // Crear nodos hoja y ordenarlos por frecuencia
    const cola = Object.entries(frecuencias)
        .map(([simbolo, freq]) => new Nodo(simbolo, freq))
        .sort((a, b) => a.frecuencia - b.frecuencia);

    while (cola.length > 1) {
        // Extraer los dos nodos con menor frecuencia
        const izquierda = cola.shift();
        const derecha = cola.shift();
        
        // Crear nodo padre
        const nodoPadre = new Nodo(null, izquierda.frecuencia + derecha.frecuencia);
        nodoPadre.izquierda = izquierda;
        nodoPadre.derecha = derecha;
        
        // Insertar en la cola y reordenar
        cola.push(nodoPadre);
        cola.sort((a, b) => a.frecuencia - b.frecuencia);
    }
    return cola[0]; // Retorna la raíz del árbol
}

// Paso 5: Generar códigos binarios (0: izquierda, 1: derecha)
function generarCodigosHuffman(nodo, codigo = '', codigos = {}) {
    if (nodo.simbolo) {
        codigos[nodo.simbolo] = codigo;
        return codigos;
    }
    generarCodigosHuffman(nodo.izquierda, codigo + '0', codigos);
    generarCodigosHuffman(nodo.derecha, codigo + '1', codigos);
    return codigos;
}

// Comprimir texto usando los códigos de Huffman
function comprimirTexto(texto, codigos) {
    return texto.split('').map(c => codigos[c]).join('');
}