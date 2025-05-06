document.addEventListener('DOMContentLoaded', function() {
    // --- DEFINICIÓN DE PLANTILLAS DE FÓRMULAS ---
    const plantillasFormulas = [
        // Átomos individuales
        { id: 'Fe', tipo: 'atomo_simple', simbolo: 'Fe', nombre: 'Hierro', esMolecula: false, esSustanciaCompuesta: false },
        { id: 'Cu', tipo: 'atomo_simple', simbolo: 'Cu', nombre: 'Cobre', esMolecula: false, esSustanciaCompuesta: false },
        { id: 'Al', tipo: 'atomo_simple', simbolo: 'Al', nombre: 'Aluminio', esMolecula: false, esSustanciaCompuesta: false },
        { id: 'Na', tipo: 'atomo_simple', simbolo: 'Na', nombre: 'Sodio', esMolecula: false, esSustanciaCompuesta: false },
        { id: 'C',  tipo: 'atomo_simple', simbolo: 'C',  nombre: 'Carbono', esMolecula: false, esSustanciaCompuesta: false },


        // Moléculas simples diatómicas
        { id: 'N2', tipo: 'molecula_simple_diatomica', formulaBase: 'N', subindice: 2, nombreElemento: 'Nitrógeno', esMolecula: true, esSustanciaCompuesta: false, atomosPorMoleculaUnica: { 'N': 2 }, numAtomosEnMoleculaUnica: 2 },
        { id: 'H2', tipo: 'molecula_simple_diatomica', formulaBase: 'H', subindice: 2, nombreElemento: 'Hidrógeno', esMolecula: true, esSustanciaCompuesta: false, atomosPorMoleculaUnica: { 'H': 2 }, numAtomosEnMoleculaUnica: 2 },
        { id: 'O2', tipo: 'molecula_simple_diatomica', formulaBase: 'O', subindice: 2, nombreElemento: 'Oxígeno', esMolecula: true, esSustanciaCompuesta: false, atomosPorMoleculaUnica: { 'O': 2 }, numAtomosEnMoleculaUnica: 2 },
        { id: 'Cl2', tipo: 'molecula_simple_diatomica', formulaBase: 'Cl', subindice: 2, nombreElemento: 'Cloro', esMolecula: true, esSustanciaCompuesta: false, atomosPorMoleculaUnica: { 'Cl': 2 }, numAtomosEnMoleculaUnica: 2 },
        { id: 'Br2', tipo: 'molecula_simple_diatomica', formulaBase: 'Br', subindice: 2, nombreElemento: 'Bromo', esMolecula: true, esSustanciaCompuesta: false, atomosPorMoleculaUnica: { 'Br': 2 }, numAtomosEnMoleculaUnica: 2 },
        { id: 'F2', tipo: 'molecula_simple_diatomica', formulaBase: 'F', subindice: 2, nombreElemento: 'Flúor', esMolecula: true, esSustanciaCompuesta: false, atomosPorMoleculaUnica: { 'F': 2 }, numAtomosEnMoleculaUnica: 2 },

        // Moléculas compuestas
        { id: 'H2O', tipo: 'molecula_compuesta', formulaVisible: 'H₂O', nombre: 'Agua', esMolecula: true, esSustanciaCompuesta: true, atomosPorMoleculaUnica: { H: 2, O: 1 } },
        { id: 'CO2', tipo: 'molecula_compuesta', formulaVisible: 'CO₂', nombre: 'Dióxido de Carbono', esMolecula: true, esSustanciaCompuesta: true, atomosPorMoleculaUnica: { C: 1, O: 2 } },
        { id: 'CH4', tipo: 'molecula_compuesta', formulaVisible: 'CH₄', nombre: 'Metano', esMolecula: true, esSustanciaCompuesta: true, atomosPorMoleculaUnica: { C: 1, H: 4 } },
        { id: 'NH3', tipo: 'molecula_compuesta', formulaVisible: 'NH₃', nombre: 'Amoniaco', esMolecula: true, esSustanciaCompuesta: true, atomosPorMoleculaUnica: { N: 1, H: 3 } },
        { id: 'H2SO4', tipo: 'molecula_compuesta', formulaVisible: 'H₂SO₄', nombre: 'Ácido Sulfúrico', esMolecula: true, esSustanciaCompuesta: true, atomosPorMoleculaUnica: { H: 2, S: 1, O: 4 } },
        { id: 'Al(OH)3', tipo: 'molecula_compuesta', formulaVisible: 'Al(OH)₃', nombre: 'Hidróxido de Aluminio', esMolecula: true, esSustanciaCompuesta: true, atomosPorMoleculaUnica: { Al: 1, O: 3, H: 3 } },
        { id: 'NaCl', tipo: 'molecula_compuesta', formulaVisible: 'NaCl', nombre: 'Cloruro de Sodio', esMolecula: true, esSustanciaCompuesta: true, atomosPorMoleculaUnica: { Na: 1, Cl: 1 } },
    ];

    // --- ESTADO DEL JUEGO ---
    let puntuacion = 0;
    let ejemploActual = {};
    let coeficienteActual = 1;
    let preguntasRespondidasCorrectamente = 0;
    let totalPreguntasDelEjemplo = 0;

    // --- ELEMENTOS DEL DOM ---
    const elPuntuacion = document.getElementById('puntuacion');
    const elExpresionQuimica = document.getElementById('expresionQuimica');
    const elSiguienteEjemploBtn = document.getElementById('siguienteEjemploBtn');
    const elMensajeFinal = document.getElementById('mensajeFinal');

    // Contenedores de preguntas
    const bloquesPregunta = {
        1: document.getElementById('bloquePregunta1'),
        2: document.getElementById('bloquePregunta2'),
        '3a': document.getElementById('bloquePregunta3a'),
        '3b': document.getElementById('bloquePregunta3b'),
        '3c': document.getElementById('bloquePregunta3c')
    };

    // Feedbacks
    const feedbacks = {
        1: document.getElementById('feedback1'),
        2: document.getElementById('feedback2'),
        '3a': document.getElementById('feedback3a'),
        '3b_moleculas': document.getElementById('feedback3b_moleculas'),
        '3b_atomosPorMolecula': document.getElementById('feedback3b_atomosPorMolecula'),
        '3b_atomosTotales': document.getElementById('feedback3b_atomosTotales'),
        '3c_moleculas': document.getElementById('feedback3c_moleculas')
        // Feedbacks para 3c (átomos en molécula y totales) se generan dinámicamente
    };
    
    // Inputs y botones específicos
    const inputRespuestaCantidadAtomos = document.getElementById('respuestaCantidadAtomos');
    const btnCorregirCantidadAtomos = document.getElementById('btnCorregirCantidadAtomos');

    const inputCantidadMoleculasSimples = document.getElementById('respuestaCantidadMoleculasSimples');
    const inputAtomosPorMoleculaSimple = document.getElementById('respuestaAtomosPorMoleculaSimple');
    const inputAtomosTotalesSimples = document.getElementById('respuestaAtomosTotalesSimples');
    
    const inputCantidadMoleculasCompuestas = document.getElementById('respuestaCantidadMoleculasCompuestas');
    const containerAtomosPorMoleculaCompuesta = document.getElementById('atomosPorMoleculaCompuestaContainer');
    const containerAtomosTotalesCompuestos = document.getElementById('atomosTotalesCompuestosContainer');


    // --- LÓGICA DEL JUEGO ---

    function iniciarNuevoEjemplo() {
        preguntasRespondidasCorrectamente = 0;
        elMensajeFinal.style.display = 'none';
        elSiguienteEjemploBtn.style.display = 'none';

        // Seleccionar una plantilla aleatoria
        ejemploActual = plantillasFormulas[Math.floor(Math.random() * plantillasFormulas.length)];
        
        // Generar coeficiente aleatorio (1 a 4, o 1 el 50% de las veces)
        coeficienteActual = Math.random() < 0.5 ? 1 : Math.floor(Math.random() * 3) + 2;

        let formulaMostrada = "";
        if (ejemploActual.tipo === 'atomo_simple') {
            formulaMostrada = ejemploActual.simbolo;
        } else if (ejemploActual.tipo === 'molecula_simple_diatomica') {
            formulaMostrada = `${ejemploActual.formulaBase}<sub>${ejemploActual.subindice}</sub>`;
        } else { // molecula_compuesta
            formulaMostrada = ejemploActual.formulaVisible; // Ya viene con subíndices
        }

        elExpresionQuimica.innerHTML = (coeficienteActual > 1 ? coeficienteActual + " " : "") + formulaMostrada;

        // Resetear y mostrar preguntas
        resetearInterfazPreguntas();
        mostrarBloquePregunta('1');
        configurarPreguntasEspecificas();
    }

    function resetearInterfazPreguntas() {
        Object.values(bloquesPregunta).forEach(bloque => bloque.style.display = 'none');
        Object.values(feedbacks).forEach(fb => { if(fb) fb.textContent = ''; });
        
        // Limpiar inputs
        if(inputRespuestaCantidadAtomos) inputRespuestaCantidadAtomos.value = '';
        if(inputCantidadMoleculasSimples) inputCantidadMoleculasSimples.value = '';
        if(inputAtomosPorMoleculaSimple) inputAtomosPorMoleculaSimple.value = '';
        if(inputAtomosTotalesSimples) inputAtomosTotalesSimples.value = '';
        if(inputCantidadMoleculasCompuestas) inputCantidadMoleculasCompuestas.value = '';
        
        containerAtomosPorMoleculaCompuesta.innerHTML = '';
        containerAtomosTotalesCompuestos.innerHTML = '';

        // Reactivar botones de opción
        bloquesPregunta['1'].querySelectorAll('button').forEach(btn => btn.disabled = false);
        bloquesPregunta['2'].querySelectorAll('button').forEach(btn => btn.disabled = false);
    }

    function mostrarBloquePregunta(idBloque) {
        if (bloquesPregunta[idBloque]) {
            bloquesPregunta[idBloque].style.display = 'block';
        }
    }
    
    function deshabilitarBotones(bloqueId) {
        bloquesPregunta[bloqueId].querySelectorAll('button').forEach(btn => btn.disabled = true);
    }

    function actualizarPuntuacion(puntos) {
        puntuacion += puntos;
        elPuntuacion.textContent = puntuacion;
    }

    function mostrarFeedback(feedbackElement, esCorrecto) {
        if (feedbackElement) {
            feedbackElement.textContent = esCorrecto ? '✅' : '❌';
            feedbackElement.className = 'feedback-icon ' + (esCorrecto ? 'ok' : 'ko');
        }
        actualizarPuntuacion(esCorrecto ? 1 : -1);
        if (esCorrecto) {
            preguntasRespondidasCorrectamente++;
        }
    }

    function verificarFinDeEjemplo() {
        if (preguntasRespondidasCorrectamente === totalPreguntasDelEjemplo) {
            elMensajeFinal.textContent = "¡Muy bien! Has completado este ejemplo correctamente.";
            elMensajeFinal.style.color = "#27ae60"; // Verde
            elMensajeFinal.style.display = 'block';
            elSiguienteEjemploBtn.style.display = 'block';
        } else if (todasLasPreguntasIntentadas()) {
             elMensajeFinal.textContent = "Algunas respuestas no fueron correctas. ¡Sigue practicando!";
             elMensajeFinal.style.color = "#e74c3c"; // Rojo
             elMensajeFinal.style.display = 'block';
             elSiguienteEjemploBtn.style.display = 'block';
        }
    }
    
    function todasLasPreguntasIntentadas() {
        // Verifica si todos los feedbacks visibles tienen contenido (OK/KO)
        let todasIntentadas = true;
        if (bloquesPregunta['1'].style.display !== 'none' && feedbacks['1'].textContent === '') todasIntentadas = false;
        if (bloquesPregunta['2'].style.display !== 'none' && feedbacks['2'].textContent === '') todasIntentadas = false;

        if (ejemploActual.tipo === 'atomo_simple' && bloquesPregunta['3a'].style.display !== 'none') {
            if (feedbacks['3a'].textContent === '') todasIntentadas = false;
        } else if (ejemploActual.tipo === 'molecula_simple_diatomica' && bloquesPregunta['3b'].style.display !== 'none') {
            if (feedbacks['3b_moleculas'].textContent === '') todasIntentadas = false;
            if (feedbacks['3b_atomosPorMolecula'].textContent === '') todasIntentadas = false;
            if (feedbacks['3b_atomosTotales'].textContent === '') todasIntentadas = false;
        } else if (ejemploActual.tipo === 'molecula_compuesta' && bloquesPregunta['3c'].style.display !== 'none') {
            if (feedbacks['3c_moleculas'].textContent === '') todasIntentadas = false;
            // Chequear feedbacks dinámicos
            containerAtomosPorMoleculaCompuesta.querySelectorAll('.feedback-icon').forEach(fb => {
                if (fb.textContent === '') todasIntentadas = false;
            });
            containerAtomosTotalesCompuestos.querySelectorAll('.feedback-icon').forEach(fb => {
                if (fb.textContent === '') todasIntentadas = false;
            });
        }
        return todasIntentadas;
    }


    // --- CONFIGURACIÓN DE PREGUNTAS ESPECÍFICAS ---
    function configurarPreguntasEspecificas() {
        // Pregunta 1: Átomo o Molécula
        totalPreguntasDelEjemplo = 1; // Mínimo una pregunta (la 1)

        bloquesPregunta['1'].querySelectorAll('button').forEach(btn => {
            btn.onclick = () => {
                const respuestaUsuario = btn.dataset.respuesta === 'molecula';
                const esCorrecto = (respuestaUsuario === ejemploActual.esMolecula);
                mostrarFeedback(feedbacks['1'], esCorrecto);
                deshabilitarBotones('1');
                if (esCorrecto) {
                    mostrarBloquePregunta('2'); // Siguiente pregunta
                } else {
                    verificarFinDeEjemplo();
                }
            };
        });

        // Pregunta 2: Simple o Compuesta
        totalPreguntasDelEjemplo++;
        bloquesPregunta['2'].querySelectorAll('button').forEach(btn => {
            btn.onclick = () => {
                const respuestaUsuario = btn.dataset.respuesta === 'compuesta';
                const esCorrecto = (respuestaUsuario === ejemploActual.esSustanciaCompuesta);
                mostrarFeedback(feedbacks['2'], esCorrecto);
                deshabilitarBotones('2');
                if (esCorrecto) {
                    // Determinar qué bloque 3 mostrar
                    if (ejemploActual.tipo === 'atomo_simple') {
                        mostrarBloquePregunta('3a');
                        totalPreguntasDelEjemplo++; // Se añade la pregunta 3a
                    } else if (ejemploActual.tipo === 'molecula_simple_diatomica') {
                        mostrarBloquePregunta('3b');
                        totalPreguntasDelEjemplo += 3; // Se añaden 3 subpreguntas en 3b
                    } else if (ejemploActual.tipo === 'molecula_compuesta') {
                        mostrarBloquePregunta('3c');
                        // Contar preguntas para 3c
                        totalPreguntasDelEjemplo++; // Por cantidad de moléculas
                        totalPreguntasDelEjemplo += Object.keys(ejemploActual.atomosPorMoleculaUnica).length; // Por cada tipo de átomo en una molécula
                        totalPreguntasDelEjemplo += Object.keys(ejemploActual.atomosPorMoleculaUnica).length; // Por cada tipo de átomo en total
                        generarPreguntasDinamicas3c();
                    }
                } else {
                     verificarFinDeEjemplo();
                }
            };
        });
        
        // Pregunta 3a: Cuántos átomos (para átomos individuales)
        btnCorregirCantidadAtomos.onclick = () => {
            const respuestaUsuario = parseInt(inputRespuestaCantidadAtomos.value);
            const esCorrecto = (respuestaUsuario === coeficienteActual);
            mostrarFeedback(feedbacks['3a'], esCorrecto);
            btnCorregirCantidadAtomos.disabled = true;
            verificarFinDeEjemplo();
        };

        // Pregunta 3b: Moléculas simples
        bloquesPregunta['3b'].querySelectorAll('button').forEach(btn => {
            btn.onclick = (e) => {
                const subpregunta = e.target.dataset.subpregunta;
                let esCorrecto = false;
                let feedbackEl;

                if (subpregunta === 'cantidadMoleculas') {
                    esCorrecto = (parseInt(inputCantidadMoleculasSimples.value) === coeficienteActual);
                    feedbackEl = feedbacks['3b_moleculas'];
                } else if (subpregunta === 'atomosPorMolecula') {
                    esCorrecto = (parseInt(inputAtomosPorMoleculaSimple.value) === ejemploActual.numAtomosEnMoleculaUnica);
                    feedbackEl = feedbacks['3b_atomosPorMolecula'];
                } else if (subpregunta === 'atomosTotales') {
                    esCorrecto = (parseInt(inputAtomosTotalesSimples.value) === coeficienteActual * ejemploActual.numAtomosEnMoleculaUnica);
                    feedbackEl = feedbacks['3b_atomosTotales'];
                }
                mostrarFeedback(feedbackEl, esCorrecto);
                e.target.disabled = true;
                verificarFinDeEjemplo();
            };
        });
        
        // Pregunta 3c: Moléculas compuestas (botón de cantidad de moléculas)
        bloquesPregunta['3c'].querySelector('button[data-subpregunta="cantidadMoleculas"]').onclick = (e) => {
            const esCorrecto = (parseInt(inputCantidadMoleculasCompuestas.value) === coeficienteActual);
            mostrarFeedback(feedbacks['3c_moleculas'], esCorrecto);
            e.target.disabled = true;
            verificarFinDeEjemplo();
        };
    }

    function generarPreguntasDinamicas3c() {
        containerAtomosPorMoleculaCompuesta.innerHTML = '<label>¿Cuántos átomos de cada tipo hay en <strong>UNA</strong> molécula?</label>';
        containerAtomosTotalesCompuestos.innerHTML = '<label>¿Cuántos átomos de cada tipo hay <strong>EN TOTAL</strong>?</label>';

        for (const elemento in ejemploActual.atomosPorMoleculaUnica) {
            const cantidadEnUnaMolecula = ejemploActual.atomosPorMoleculaUnica[elemento];

            // Para "átomos en UNA molécula"
            let divPreguntaUnica = document.createElement('div');
            divPreguntaUnica.innerHTML = `
                <label for="comp_unica_${elemento}">Átomos de ${elemento}:</label>
                <input type="number" id="comp_unica_${elemento}" min="1">
                <button data-elemento="${elemento}" data-tipo="unica">Corregir</button>
                <span class="feedback-icon" id="fb_comp_unica_${elemento}"></span>
            `;
            containerAtomosPorMoleculaCompuesta.appendChild(divPreguntaUnica);
            
            // Para "átomos EN TOTAL"
            let divPreguntaTotal = document.createElement('div');
            divPreguntaTotal.innerHTML = `
                <label for="comp_total_${elemento}">Átomos de ${elemento} (total):</label>
                <input type="number" id="comp_total_${elemento}" min="1">
                <button data-elemento="${elemento}" data-tipo="total">Corregir</button>
                <span class="feedback-icon" id="fb_comp_total_${elemento}"></span>
            `;
            containerAtomosTotalesCompuestos.appendChild(divPreguntaTotal);
        }

        // Añadir event listeners a los botones generados
        containerAtomosPorMoleculaCompuesta.querySelectorAll('button').forEach(btn => {
            btn.onclick = (e) => {
                const el = e.target.dataset.elemento;
                const inputUser = document.getElementById(`comp_unica_${el}`).value;
                const esCorrecto = (parseInt(inputUser) === ejemploActual.atomosPorMoleculaUnica[el]);
                mostrarFeedback(document.getElementById(`fb_comp_unica_${el}`), esCorrecto);
                e.target.disabled = true;
                verificarFinDeEjemplo();
            };
        });
        containerAtomosTotalesCompuestos.querySelectorAll('button').forEach(btn => {
            btn.onclick = (e) => {
                const el = e.target.dataset.elemento;
                const inputUser = document.getElementById(`comp_total_${el}`).value;
                const esCorrecto = (parseInt(inputUser) === ejemploActual.atomosPorMoleculaUnica[el] * coeficienteActual);
                mostrarFeedback(document.getElementById(`fb_comp_total_${el}`), esCorrecto);
                e.target.disabled = true;
                verificarFinDeEjemplo();
            };
        });
    }


    // --- INICIALIZACIÓN ---
    elSiguienteEjemploBtn.addEventListener('click', iniciarNuevoEjemplo);
    iniciarNuevoEjemplo(); // Cargar el primer ejemplo al iniciar
});