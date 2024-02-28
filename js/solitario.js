/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos:
let palos = ["ova", "cua", "hex", "cir"];
// Array de número de cartas:
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
// let numeros = [10, 11, 12];

// Paso (top y left) en pixeles de una carta a la siguiente en un mazo:
let paso = 5;

// Tapetes
let tapete_inicial   = document.getElementById("inicial");
let tapete_sobrantes = document.getElementById("sobrantes");
let tapete_receptor1 = document.getElementById("receptor1");
let tapete_receptor2 = document.getElementById("receptor2");
let tapete_receptor3 = document.getElementById("receptor3");
let tapete_receptor4 = document.getElementById("receptor4");

// Mazos
let mazo_inicial   = [];
let mazo_sobrantes = [];
let mazo_receptor1 = [];
let mazo_receptor2 = [];
let mazo_receptor3 = [];
let mazo_receptor4 = [];

// Contadores de cartas
let cont_inicial     = document.getElementById("contador_inicial");
let cont_sobrantes   = document.getElementById("contador_sobrantes");
let cont_receptor1   = document.getElementById("contador_receptor1");
let cont_receptor2   = document.getElementById("contador_receptor2");
let cont_receptor3   = document.getElementById("contador_receptor3");
let cont_receptor4   = document.getElementById("contador_receptor4");
let cont_movimientos = document.getElementById("contador_movimientos");

// Tiempo
let cont_tiempo  = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador
let moveContador = 0

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/

comenzar_juego();

// Rutina asociada a boton reset: comenzar_juego
document.getElementById("reset").onclick = comenzar_juego;

// El juego arranca ya al cargar la página: no se espera a reiniciar
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

// Desarrollo del comienzo del juego
function comenzar_juego() {
	/* Crear baraja, es decir crear el mazo_inicial. Este será un array cuyos
	elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
	Sugerencia: en dos bucles "for", bárranse los "palos" y los "numeros", formando
	oportunamente el nombre del fichero "png" que contiene a la carta (recuérdese poner
	el "path" correcto en la URL asociada al atributo "src" de <img>). Una vez creado
	el elemento <img>, inclúyase como elemento del array "mazo_inicial".
	*/

	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/



	// Vaciar los arrays
	mazo_inicial   = [];
	mazo_sobrantes = [];
	mazo_receptor1 = [];
	mazo_receptor2 = [];
	mazo_receptor3 = [];
	mazo_receptor4 = [];


	eliminarImagenes(tapete_inicial);
    eliminarImagenes(tapete_sobrantes);
    eliminarImagenes(tapete_receptor1);
    eliminarImagenes(tapete_receptor2);
    eliminarImagenes(tapete_receptor3);
	eliminarImagenes(tapete_receptor4);


	cargar_tapete_inicial(tapete_inicial);

	// Arrancar el conteo de tiempo
	arrancar_tiempo();

	moveContador = 0
	cont_movimientos.innerHTML = moveContador

} // comenzar_juego


/**
	Se debe encargar de arrancar el temporizador: cada 1000 ms se
	debe ejecutar una función que a partir de la cuenta autoincrementada
	de los segundos (segundos totales) visualice el tiempo oportunamente con el
	format hh:mm:ss en el contador adecuado.

	Para descomponer los segundos en horas, minutos y segundos pueden emplearse
	las siguientes igualdades:

	segundos = truncar (   segundos_totales % (60)                 )
	minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
	horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

	donde % denota la operación módulo (resto de la división entre los operadores)

	Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
	   00:02:14

	Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que
	evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
	el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
	a "clearInterval" en su caso.
*/

function arrancar_tiempo(){
	/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

	if (temporizador) clearInterval(temporizador);
    let hms = function (){
			let seg = Math.trunc( segundos % 60 );
			let min = Math.trunc( (segundos % 3600) / 60 );
			let hor = Math.trunc( (segundos % 86400) / 3600 );
			let tiempo = ( (hor<10)? "0"+hor : ""+hor )
						+ ":" + ( (min<10)? "0"+min : ""+min )
						+ ":" + ( (seg<10)? "0"+seg : ""+seg );
			cont_tiempo.innerHTML = tiempo
            segundos++;
		}
	segundos = 0;
    hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);

} // arrancar_tiempo


/**
	Si mazo es un array de elementos <img>, en esta rutina debe ser
	reordenado aleatoriamente. Al ser un array un objeto, se pasa
	por referencia, de modo que si se altera el orden de dicho array
	dentro de la rutina, esto aparecerá reflejado fuera de la misma.
	Para reordenar el array puede emplearse el siguiente pseudo código:

	- Recorramos con i todos los elementos del array
		- Sea j un indice cuyo valor sea un número aleatorio comprendido
			entre 0 y la longitud del array menos uno. Este valor aleatorio
			puede conseguirse, por ejemplo con la instrucción JavaScript
				Math.floor( Math.random() * LONGITUD_DEL_ARRAY );
		- Se intercambia el contenido de la posición i-ésima con el de la j-ésima

*/



/**
 	En el elemento HTML que representa el tapete inicial (variable tapete_inicial)
	se deben añadir como hijos todos los elementos <img> del array "mazo".
	Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
	coordenadas "top" y "left", algun atributo de tipo "data-", etc.
	Al final se debe ajustar el contador de cartas a la cantidad oportuna
*/
function cargar_tapete_inicial(div) {
	let combinaciones = [];
	for (let palo of palos) {
		for (let numero of numeros) {
			combinaciones.push({ palo, numero });
		}
	}

	for (let i = 0; i < 48; i++) {
		if (combinaciones.length === 0) break;

		let index = getRandomInt(0, combinaciones.length);
		let combinacion = combinaciones.splice(index, 1)[0];

		let carta = document.createElement("img");
		carta.src = `imagenes/baraja/${combinacion.numero}-${combinacion.palo}.png`;
		carta.classList.add("carta");
		carta.draggable = false; // Por defecto, deshabilitar la capacidad de arrastrar
		carta.id = `${combinacion.numero}-${combinacion.palo}`; // Establecer el ID del elemento con el formato (por ejemplo (12-cir))
		carta.addEventListener('dragstart', dragStart); // Añadir el attributo dragstart a la carta

		carta.style.position = 'absolute';
        carta.style.top = (i * paso) + "px";
        carta.style.left = (i * paso) + "px";

		div.appendChild(carta);
		mazo_inicial.push(`${combinacion.numero}-${combinacion.palo}`);

	}
	refreshCont()
	updateDraggability() // Actualizar la configuración de arrastrabilidad después de cargar las cartas
	animacion()

} // cargar_tapete_inicial




// Desarrollo de la continuación del juego
// Funciones drag & drop
/*** !!!!!!!!!!!!!!!!!!! CÓDIGO !!!!!!!!!!!!!!!!!!!! **/

// Función para generar un número aleatorio entre min (incluido) y max (excluido)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function dragStart(event) {
	event.dataTransfer.setData("text/plain", event.target.id);
}

function allowDrop(event) {
	event.preventDefault();
}

/*-- DROP --*/
// La funcion drop es la que controla cuando podemos hacer drop de una carta en un tapete y añadir data los arrays de tapetes
function drop(event, array) {
	event.preventDefault();
	var data = event.dataTransfer.getData("text/plain");
	let Array = nombreArray(array) // se convierte el nombre del array a un array y se almacena en un variable
	var element = document.getElementById(data);
	if (element) {
		if(array === 'mazo_receptor1' || array === 'mazo_receptor2' || array === 'mazo_receptor3' || array === 'mazo_receptor4') {
			// En el caso de que el array este vacio
			if(Array.length === 0) {
				// En el caso de que el array este vacio, si la carta no lleva el numero 12 no se puede saltarla en el tapete
				if(data.includes('12')) {
					dropCompleted(Array, data, event, element, array)
					element.draggable = false // No se permite arrastrar la carta
				}
				// En el caso de que el array tenga elementos
			} else {
				// Se coge el ultimo elemento del array y se almacena el nombre de la carta en un variable y el numero en otro variable
				let arrayUlt = Array[Array.length - 1]
				let arrSplit = arrayUlt.split("-")
				let numA = arrSplit[0]
				let letraA = arrSplit[1]
				// Ademas de que se coge el data de la carta arrastrada y se almacena el nombre de la carta en un variable y el numero en otro variable
				let dataSplit = data.split("-")
				let num = dataSplit[0]
				let letra = dataSplit[1]

				// Si el numero de la carta del array igual a el numero de la carta arratrada - 1
				if(num == numA - 1) {
					let cartaAnterior = letraA.endsWith("hex") || letraA.endsWith("cir") ? "gris" : "naranja"
					let cartaActual = letra.endsWith("ova") || letra.endsWith("cua") ? "naranja" : "gris"

					// Si el color de las dos cartas (la del array y la arrastrada) es destinto se hace el drop
					if(cartaActual !== cartaAnterior) {
						dropCompleted(Array, data, event, element, array)
						element.draggable = false // No se permite arrastrar la carta
					}
				}
			}
		// Para evitar de que se pueda hacer un drop al mismo tapte por deonde se ha arrastrado la carta
		} else if(array === 'mazo_sobrantes') {

			if(Array[Array.length - 1] !== data) {
				dropCompleted(Array, data, event, element, array)
			}

		}

	}

}

// el parametro arrayName nos devuelva solo el nombre del array, por eso cogemos el nombre y hacemos un return
// al array correspondiente a ese nombre para poder manipularlo y añadir data
function nombreArray(arrayName) {
	let arrN
	switch (arrayName) {
		case 'mazo_inicial':
			arrN = mazo_inicial
			return arrN
			break
		case 'mazo_sobrantes':
			arrN = mazo_sobrantes
			return arrN
			break
		case 'mazo_receptor1':
			arrN = mazo_receptor1
			return arrN
			break
		case 'mazo_receptor2':
			arrN = mazo_receptor2
			return arrN
			break
		case 'mazo_receptor3':
			arrN = mazo_receptor3
			return arrN
			break
		case 'mazo_receptor4':
			arrN = mazo_receptor4
			return arrN
			break
		default:
			return null;
	}
}

// Eleminar la carta del array anterior despues de hacer un drop y añadir la carta a un nuevo array
function deletePrev(array, data) {
	// Se coge el nombre del array nuevo(el array del tapete al que se ha arrastrado la carta) y se busca en que array estaba antes para eliminarla de ese array
	switch (array) {
		case 'mazo_sobrantes':
			if(mazo_inicial.includes(data)) {
				mazo_inicial.pop()
			}
			break
		case 'mazo_receptor1':
			if(mazo_inicial.includes(data)) {
				mazo_inicial.pop()
			} else if(mazo_sobrantes.includes(data)) {
				mazo_sobrantes.pop()
			}
			break
		case 'mazo_receptor2':
			if(mazo_inicial.includes(data)) {
				mazo_inicial.pop()
			} else if(mazo_sobrantes.includes(data)) {
				mazo_sobrantes.pop()
			}
			break
		case 'mazo_receptor3':
			if(mazo_inicial.includes(data)) {
				mazo_inicial.pop()
			} else if(mazo_sobrantes.includes(data)) {
				mazo_sobrantes.pop()
			}
			break
		case 'mazo_receptor4':
			if(mazo_inicial.includes(data)) {
				mazo_inicial.pop()
			} else if(mazo_sobrantes.includes(data)) {
				mazo_sobrantes.pop()
			}
			break
		default:
			return null;
	}

	// Quitar el style de top y left a la carta
	let element = document.getElementById(data)
	element.style.top = ''
	element.style.left = ''

}

// Configuraciones del drop de cartas
function dropCompleted(Array, data, event, element, array) {
	Array.push(data) // Añadir data de la carta al array
	deletePrev(array, data) // Eleminar data de la carta del array anterior

	// Obtener el elemento anterior al que se va a insertar
	if(event.target.localName === 'div') {
		event.target.appendChild(element);
	} else {
		// Si no hay elementos anteriores, insertar la carta después del div objetivo
		event.target.insertAdjacentElement('afterend', element);
	}

	// Actualizar la configuración de arrastrabilidad
	updateDraggability();

	moveCont() // Actualizar el contador de movimientos
	refreshCont() // Actualizar los contadores
	gameOver() // Checkear el game over
}

function updateDraggability() {
	// Deshabilitar la capacidad de arrastrar para todos los elementos <img> en el div
	let imgElements = document.querySelectorAll('#inicial img');
	imgElements.forEach((img, index) => {
		img.draggable = false;
	});
	// Habilitar la capacidad de arrastrar solo para el último elemento
	if (imgElements.length > 0) {
		imgElements[imgElements.length - 1].draggable = true;
	}

}

// Eleminar la ultima carta del div(tapete) especificado
function eliminarImagenes(divId) {
	while(divId.lastChild.localName === "img") {
		divId.removeChild(divId.lastChild)
	}
}

// Actualizar los contadores de cartas para los tapetes
function refreshCont() {
	cont_inicial.innerHTML = mazo_inicial.length
	cont_sobrantes.innerHTML = mazo_sobrantes.length
	cont_receptor1.innerHTML = mazo_receptor1.length
	cont_receptor2.innerHTML = mazo_receptor2.length
	cont_receptor3.innerHTML = mazo_receptor3.length
	cont_receptor4.innerHTML = mazo_receptor4.length
}

function moveCont() {
	moveContador++
	cont_movimientos.innerHTML = moveContador
}

// Animacion de cartas y tapetes
function animacion() {
	timerId = null
	let degrees = 0
	timerId = setInterval(frame, 9)

	function frame() {
		if(degrees < 360) {
			degrees+=3
			// Aplicar la animacion a las cartas que esten dentro del tapete inicial
			for (let i = 0; i < tapete_inicial.children.length; i++) {
				tapete_inicial.children[i].style.transform = "rotateY("+degrees+"deg)"
			}
			// Aplicar la animacion a los tapetes
			tapete_sobrantes.style.transform = "rotateX("+degrees+"deg)"
			tapete_receptor1.style.transform = "rotateX("+degrees+"deg)"
			tapete_receptor2.style.transform = "rotateX("+degrees+"deg)"
			tapete_receptor3.style.transform = "rotateX("+degrees+"deg)"
			tapete_receptor4.style.transform = "rotateX("+degrees+"deg)"
		}
	}
}

// Finalizar el juego y restablecer los elementos del local storage
function gameOver() {
	//Cuando no hayan mas cartas(elementos) en los arrays mazo_sobrantes y mazo_inicial
	if(mazo_inicial.length === 0 && mazo_sobrantes.length === 0) {
		setTimeout(function() {
			if(localStorage.getItem("numeroMovimientos")) {
				alert("----- GAME OVER ----- \nMovimientos: "+ cont_movimientos.textContent +"\nTiempo: "+ cont_tiempo.textContent+"\n\n\n"
				+"----- TU MEJOR RECORD ----- \nMovimientos: "+ localStorage.getItem("numeroMovimientos") +"\nTiempo: "+ localStorage.getItem("tiempo"))
				// Si el numero de movimientos actual es menor de lo que esta almacenado se establecen numeroMovimientos y tiempo actuales
				if(cont_movimientos.textContent < localStorage.getItem("numeroMovimientos")) {
					localStorage.setItem("numeroMovimientos", cont_movimientos.textContent)
					localStorage.setItem("tiempo", cont_tiempo.textContent)
				}
			} else {
				alert("----- GAME OVER ----- \nMovimientos: "+ cont_movimientos.textContent +"\nTiempo: "+ cont_tiempo.textContent)
				localStorage.setItem("numeroMovimientos", cont_movimientos.textContent)
				localStorage.setItem("tiempo", cont_tiempo.textContent)
			}
			comenzar_juego()
		}, 1)

	}
}