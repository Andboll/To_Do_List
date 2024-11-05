function showCustomInput() {
    const selector = document.getElementById('tagSelector');
    const customTagInput = document.getElementById('customTagInput');
    
    if (selector.value === 'custom') {
        customTagInput.style.display = 'block';
        customTagInput.value = '';
    } else {
        customTagInput.style.display = 'none';
    }
}

// Función para cargar tareas desde localStorage
function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareasGuardadas.forEach(tarea => {
        agregarTarea(tarea.texto, tarea.fecha, tarea.etiqueta);
    });
}

// Función para agregar tarea (modificada para aceptar parámetros)
function agregarTarea(tareaTexto, fechaTexto, tagTexto) {
    const tareaInput = document.querySelector('.to-do-input');
    const fechaInput = document.querySelector('.date-input');
    const tagInput = document.querySelector('.tag-input');
    const customTagInput = document.querySelector('#customTagInput');

    // Si no se pasan parámetros, se obtienen de los inputs
    if (!tareaTexto) {
        tareaTexto = tareaInput.value;
        fechaTexto = fechaInput.value;
        tagTexto = tagInput.value === 'custom' ? customTagInput.value : tagInput.value;
    }

    if (tareaTexto) {
        const nuevaTarea = document.createElement('li');
        nuevaTarea.className = 'to-do-item';

        // Crear elementos para mostrar la tarea, fecha y etiqueta
        const tareaSpan = document.createElement('span');
        tareaSpan.innerHTML = `<strong>${tareaTexto}</strong>`;

        const fechaSpan = document.createElement('span');
        fechaSpan.textContent = fechaTexto ? `${fechaTexto}` : '';
        fechaSpan.style.color = 'gray';

        const tagSpan = document.createElement('span');
        tagSpan.textContent = tagTexto;
        tagSpan.style.padding = '5px';
        tagSpan.style.borderRadius = '5px';

        // Asignar color de fondo dependiendo de la etiqueta
        if (tagTexto === 'custom') {
            tagTexto = customTagInput.value;
            tagSpan.style.color = 'white'; // Color de texto predeterminado
            tagSpan.style.backgroundColor = 'orange'; // Color de fondo predeterminado
            tagSpan.style.border = '2px solid black'; // Color de borde predeterminado
        } else {
            switch (tagTexto) {
                case 'Trabajo':
                    tagSpan.style.backgroundColor = 'blue';
                    tagSpan.style.color = 'white';
                    break;
                case 'Personal':
                    tagSpan.style.backgroundColor = 'green';
                    tagSpan.style.color = 'white';
                    break;
                case 'Urgente':
                    tagSpan.style.backgroundColor = 'red';
                    tagSpan.style.color = 'white';
                    break;
                default:
                    tagSpan.style.backgroundColor = 'black';
                    tagSpan.style.color = 'white';
            }
        }

        // Crear un contenedor para la información de la tarea
        const infoContainer = document.createElement('div');
        infoContainer.className = 'info-container'; // Clase para el contenedor de información

        // Añadir los spans al contenedor de información
        infoContainer.appendChild(tareaSpan);
        infoContainer.appendChild(fechaSpan);
        infoContainer.appendChild(tagSpan);

        // Crear un contenedor para los botones
        const botonesContainer = document.createElement('div');
        botonesContainer.className = 'botones-container'; // Clase para el contenedor de botones

        // Crear botón de completar (circular)
        const botonCompletar = document.createElement('div');
        botonCompletar.className = 'boton-completar'; // Clase para el estilo
        botonCompletar.onclick = function() {
            const completa = nuevaTarea.classList.toggle('completa');
            tareaSpan.style.textDecoration = completa ? 'line-through' : 'none'; // Tachar o subrayar
            botonCompletar.style.backgroundColor = completa ? '#4caf50' : ''; // Cambiar color
        };

        // Crear botón de editar (tres puntos)
        const botonEditar = document.createElement('button');
        botonEditar.innerHTML = '&#8230;'; // Carácter Unicode para tres puntos
        botonEditar.className = 'boton-editar'; // Clase para el estilo
        botonEditar.onclick = function() {
            // Crear inputs para editar
            const inputTarea = document.createElement('input');
            inputTarea.className = 'edit-input'; // Clase para el input de tarea
            inputTarea.value = tareaSpan.textContent; // Usar el texto actual

            const inputFecha = document.createElement('input');
            inputFecha.type = 'date';
            inputFecha.className = 'edit-input'; // Clase para el input de fecha
            inputFecha.value = fechaTexto; // Usar la fecha actual

            const inputTag = document.createElement('select');
            inputTag.className = 'edit-select'; // Clase para el select
            inputTag.innerHTML = `
                <option value="Trabajo">Trabajo</option>
                <option value="Personal">Personal</option>
                <option value="Urgente">Urgente</option>
                <option value="custom">personalizado</option>
            `;
            inputTag.value = tagTexto; // Usar la etiqueta actual

            // Cambiar el botón de guardar a un círculo con un signo de "bien"
            const botonGuardar = document.createElement('div');
            botonGuardar.className = 'boton-guardar'; // Nueva clase para el botón
            botonGuardar.innerHTML = '&#10003;'; // Carácter Unicode para el signo de "bien"
            
            botonGuardar.onclick = function() {
                // Actualizar el texto de la tarea
                tareaSpan.innerHTML = `<strong>${inputTarea.value}</strong>`;
                fechaSpan.textContent = ` - ${inputFecha.value}`; // Actualizar la fecha
                tagSpan.textContent = inputTag.value; // Actualizar la etiqueta

                // Asignar color de fondo dependiendo de la etiqueta
                if (inputTag.value === 'custom') {
                    tagTexto = inputTag.value;
                    tagSpan.style.color = 'white'; // Color de texto predeterminado
                    tagSpan.style.backgroundColor = 'orange'; // Color de fondo predeterminado
                    tagSpan.style.border = '2px solid black'; // Color de borde predeterminado
                } else {
                    switch (inputTag.value) {
                        case 'Trabajo':
                            tagSpan.style.backgroundColor = 'blue';
                            break;
                        case 'Personal':
                            tagSpan.style.backgroundColor = 'green';
                            break;
                        case 'Urgente':
                            tagSpan.style.backgroundColor = 'red';
                            break;
                        default:
                            tagSpan.style.backgroundColor = 'black';
                    }
                }

                // Reemplazar los elementos en el DOM
                infoContainer.replaceChild(tareaSpan, inputTarea);
                infoContainer.replaceChild(fechaSpan, inputFecha);
                infoContainer.replaceChild(tagSpan, inputTag);
                botonesContainer.removeChild(botonGuardar); // Eliminar el botón de guardar
                // Actualizar localStorage
                actualizarLocalStorage();
            };

            // Reemplazar los elementos en el DOM
            infoContainer.replaceChild(inputTarea, tareaSpan);
            infoContainer.replaceChild(inputFecha, fechaSpan);
            infoContainer.replaceChild(inputTag, tagSpan);
            botonesContainer.appendChild(botonGuardar); // Añadir el botón de guardar
        };
        
        // Crear botón de eliminar (caneca de oficina)
        const botonEliminar = document.createElement('button');
        botonEliminar.innerHTML = '&#128465;'; // Carácter Unicode para la caneca de oficina
        botonEliminar.className = 'boton-eliminar'; // Clase para el estilo
        botonEliminar.onclick = function() {
            nuevaTarea.remove(); // Elimina la tarea
            actualizarLocalStorage(); // Actualizar localStorage
        };
        
        // Añadir los botones al contenedor
        botonesContainer.appendChild(botonCompletar); // Añadir el botón de completar
        botonesContainer.appendChild(botonEditar); // Añadir el botón de editar
        botonesContainer.appendChild(botonEliminar); // Añadir el botón de eliminar

        // Añadir el contenedor de información y los botones a la nueva tarea
        nuevaTarea.appendChild(botonCompletar); // Círculo a la izquierda
        nuevaTarea.appendChild(infoContainer); // Contenedor de información
        nuevaTarea.appendChild(botonesContainer); // Añadir el contenedor de botones al final

        document.querySelector('.to-dos').appendChild(nuevaTarea);
        
        // Limpiar los inputs
        tareaInput.value = '';
        fechaInput.value = '';
        customTagInput.value = '';
        tagInput.value = 'Trabajo'; // Restablecer a la opción por defecto

        // Actualizar localStorage
        actualizarLocalStorage();
    }
}

// Función para actualizar localStorage
function actualizarLocalStorage() {
    const tareas = [];
    document.querySelectorAll('.to-dos li').forEach(tarea => {
        const tareaTexto = tarea.querySelector('span:nth-child(1)').textContent;
        const fechaTexto = tarea.querySelector('span:nth-child(2)').textContent.replace(' - ', '');
        const tagTexto = tarea.querySelector('span:nth-child(3)').textContent;
        tareas.push({ texto: tareaTexto, fecha: fechaTexto, etiqueta: tagTexto });
    });
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

// Función para filtrar tareas
let estadoActual = 'todas'; // Estado inicial
function filtrarTareas(estado) {
    const tareas = document.querySelectorAll('.to-dos li');
    const listaTareas = document.querySelector('.to-dos-container'); // Seleccionar el contenedor de tareas

    tareas.forEach(tarea => {
        const estaCompleta = tarea.classList.contains('completa');
        if (estado === 'completas' && !estaCompleta) {
            tarea.style.display = 'none'; // Ocultar tareas no completadas
        } else if (estado === 'pendientes' && estaCompleta) {
            tarea.style.display = 'none'; // Ocultar tareas completadas
        } else {
            tarea.style.display = 'flex'; // Mostrar tareas que coinciden y mantener el estilo
        }
    });

    // Ajustar el color de fondo de la lista según el estado
    if (estado === 'Trabajo') {
        listaTareas.style.backgroundColor = 'lightblue'; // Color de fondo para tareas de trabajo
    } else {
        listaTareas.style.backgroundColor = ''; // Restablecer a color por defecto
    }
}

// Asignar eventos a los botones de filtro existentes
const botonesFiltro = document.querySelectorAll('.filter');
botonesFiltro.forEach(boton => {
    boton.onclick = function() {
        const estado = boton.dataset.estado; // Suponiendo que tienes un atributo data-estado en los botones
        
        // Verificar si el botón ya está activo
        const yaActivo = boton.classList.contains('active');

        // Remover la clase 'active' de todos los botones
        botonesFiltro.forEach(b => b.classList.remove('active'));
        
        if (!yaActivo) {
            // Agregar la clase 'active' al botón presionado solo si no estaba activo
            boton.classList.add('active');
        }

        // Actualizar el estado actual
        estadoActual = yaActivo ? 'todas' : estado; // Si estaba activo, mostrar todas las tareas
        filtrarTareas(estadoActual);
    };
});

// Función para eliminar todas las tareas
function eliminarTodasLasTareas() {
    const listaTareas = document.querySelector('.to-dos');
    while (listaTareas.firstChild) {
        listaTareas.removeChild(listaTareas.firstChild); // Eliminar todas las tareas
    }
    actualizarLocalStorage(); // Actualizar localStorage
}

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', cargarTareas);
