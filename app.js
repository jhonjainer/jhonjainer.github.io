//definimos las Variables que son tipo Const puesto que no se reasigna.
//querySelector() porque solo tengo un carrito. el querySelector()devuelve el primer elemento del documento (utilizando un recorrido primero en profundidad pre ordenado de los nodos del documento) que coincida con el grupo especificado de selectores.
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 
let articulosCarrito = [];

// Listeners
//El método addEventListener() nos sirve para registra un evento a un objeto en específico.

cargarEventListeners();

function cargarEventListeners() {
     // Dispara cuando se presiona "Agregar Carrito"
     listaCursos.addEventListener('click', agregarCurso);

     // Cuando se elimina un curso del carrito
     carrito.addEventListener('click', eliminarCurso);

     // Al Vaciar el carrito
     vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

}




// Funciones
// Función que añade el curso al carrito
function agregarCurso(e) {
     e.preventDefault(); // este metodo es para que cuando se de clic en un enlace no se suba al inicio de la pagina, es decir que previene la accion por defecto.
     //Accion para agregar-carrito
	 //Si el elemento que selecciono el usuario fue el boton Agregar al carrito
		//e.target para saber donde estamos dando click
			//e.target.classList para ver las clases de donde estamos dando click
				//e.target.classList.contains es para ver si se dio clic en el boton de la clase "agrear carrito"
				
				//console.log(e.target.classList);
     if(e.target.classList.contains('agregar-carrito')) {
			//console.log(e.target.parentElement.parentElement);
			//Dado que el titulo del curso esta como padre del DIV debemos hacer un parentElement y otro parentElement para subir de nivel y llegar al titulo.
          const curso = e.target.parentElement.parentElement;
          // Enviamos el curso seleccionado para tomar sus datos
          leerDatosCurso(curso);
     }
}

// Lee el contenido del HTML al que le dimos click y extrae la informacion del curso.
//Creamos el Objeto con toda la informacion del curso.
function leerDatosCurso(curso) {
	const infoCurso = {
          imagen: curso.querySelector('img').src,
          titulo: curso.querySelector('h4').textContent,
          precio: curso.querySelector('.precio span').textContent,
          id: curso.querySelector('a').getAttribute('data-id'), 
          cantidad: 1
     }
	// con este consolo miremos como se esta construyendo nuestro objeto. 
	console.log(infoCurso);
// con este IF vamos a validar si un curso ya existe en el carrito y la funcion .some nos permite iterar en el arreglo y buscar si un objeto existe.
     if( articulosCarrito.some( curso => curso.id === infoCurso.id ) ) { 
          const cursos = articulosCarrito.map( curso => {
               if( curso.id === infoCurso.id ) {
                    curso.cantidad++;
                     return curso;
                } else {
                     return curso;
             }
          })
          articulosCarrito = [...cursos];  //...cursos nos esta acumulando lo que el carrito tiene cargado
     }  else {
          articulosCarrito = [...articulosCarrito, infoCurso]; // esta linea es un acumulador, toma lo que tiene el carrito con ...articulosCarrito y le manda el nuevo curso que esta en infoCurso
     }

     console.log(articulosCarrito)

     

     // console.log(articulosCarrito)
     carritoHTML();
}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
     e.preventDefault();
	 //console.log(e.target.classList);
     if(e.target.classList.contains('borrar-curso') ) {
          // e.target.parentElement.parentElement.remove();
          const cursoId = e.target.getAttribute('data-id')
          
          // el metodo filter Eliminar el curso del arreglo del carrito
          articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

          carritoHTML();// se repite la iteracion sobre el HTML para actualizarlo
     }
}


// Muestra el curso seleccionado en el Carrito
// Esta funcion toma el objeto que tenemos en el arreglo y lo muestra en el HTML de la pagina Index.
function carritoHTML() {
	// con esta limpiamos el HTML
	// Con la siguiente linea lo que vamos hacer es limpiar el HTML para que cargue el carrito con los elemento existentes.
     vaciarCarrito();
	//Recorre el carrito y genera el HTML
     articulosCarrito.forEach(curso => {
          const row = document.createElement('tr');
		  //aqui vamos a construir un template de String para llevarlo a la fila de la tabla
          row.innerHTML = `
               <td>  
                    <img src="${curso.imagen}" width=100>
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>${curso.cantidad} </td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
               </td>
          `;
		  //las anteriores lineas de codigo son HTML.
          //con el siguiente metodo agrega el HTML del carrito al tbody de la pagina principal
		  contenedorCarrito.appendChild(row);
		  
     });

}

// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
     // forma lenta
     // contenedorCarrito.innerHTML = '';


     // forma rapida (recomendada)
     while(contenedorCarrito.firstChild) {
          contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      }
}

// Agregamos el botón de pagar y asignamos un evento
const pagarBtn = document.querySelector('#pagar'); // Botón de pago

// Escuchador de eventos para el botón de "Pagar"
pagarBtn.addEventListener('click', procesarPago);

// Función para calcular el total del carrito
function calcularTotal() {
    return articulosCarrito.reduce((total, curso) => {
        const precioCurso = parseFloat(curso.precio.replace('$', '').replace(',', ''));
        return total + (precioCurso * curso.cantidad);
    }, 0);
}

// Función para procesar el pago
function procesarPago(e) {
    e.preventDefault();

    // Verificamos si el carrito está vacío
    if (articulosCarrito.length === 0) {
        alert('El carrito está vacío. ¡Agrega productos para realizar una compra!');
        return;
    }

    // Calcular el total
    const total = calcularTotal();

    // Mostrar el total y pedir confirmación de pago
    const confirmarPago = confirm(`El total de tu compra es: $${total.toFixed(2)}. ¿Deseas proceder con el pago?`);

    if (confirmarPago) {
        // Si el usuario confirma, vaciar el carrito y mostrar mensaje de éxito
        vaciarCarrito();
        articulosCarrito = []; // Limpiar el carrito
        alert('¡Pago realizado con éxito! Gracias por tu compra.');
    } else {
        // Si el usuario no confirma, mostrar mensaje de cancelación
        alert('El pago ha sido cancelado.');
    }
}

// Función para actualizar el carrito en el DOM
function carritoHTML() {
    // Limpiar el carrito actual
    vaciarCarrito();

    // Recorrer los productos en el carrito y crear una fila para cada uno
    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>  
                <img src="${curso.imagen}" width="100">
            </td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>${curso.cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    });

    // Mostrar el total en el carrito
    const total = calcularTotal();
    const totalHTML = document.querySelector('#total'); // Elemento donde se muestra el total
    if (totalHTML) {
        totalHTML.innerHTML = `Total: $${total.toFixed(2)}`;
    }
}

// Función para vaciar el carrito en el DOM
function vaciarCarrito() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
