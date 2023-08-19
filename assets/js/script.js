document.getElementById('store').addEventListener('click', storeTask);
document.getElementById('update').addEventListener('click', updateStatus);
document.getElementById('delete').addEventListener('click', deleteTask);
document.getElementById('csv').addEventListener('click', csv);

// Url usada para consumir servicios del back
const url = 'http://localhost:8000/';

// Ejecuta consulta de tareas
getTasks();

function getTasks() {
    fetch(url + 'api/task', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        // Ejecuta la función para crear tabla de tareas
        generateTable(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Función para generar la tabla que muestra el listado de tareas
function generateTable(data){
    // Selecciona el contenedor
    const tableContainer = document.getElementById('table-container');
    
    // Crea la tabla
    const table = document.createElement('table');
    table.className = 'table table-striped p-2';
    table.id = "table-tasks";

    // Crea una fila de encabezado //thead//
    const encabezado = document.createElement('thead');
    encabezado.className = 'table-dark'
    const filaEncabezado = document.createElement('tr');
    const encabezado0 = document.createElement('th');
    const encabezado1 = document.createElement('th');
    encabezado1.textContent = 'Fecha (YYYY-MM-DD)';
    const encabezado2 = document.createElement('th');
    encabezado2.textContent = 'Nombre';
    const encabezado3 = document.createElement('th');
    encabezado3.textContent = 'Descripción';
    const encabezado4 = document.createElement('th');
    encabezado4.textContent = 'Estado';
    
    filaEncabezado.appendChild(encabezado0);
    filaEncabezado.appendChild(encabezado1);
    filaEncabezado.appendChild(encabezado2);
    filaEncabezado.appendChild(encabezado3);
    filaEncabezado.appendChild(encabezado4);
    encabezado.appendChild(filaEncabezado);

    // Crea filas y llena cada celda con los datos pasados por parametro //tbody//
    const cuerpo = document.createElement('tbody');
    for (let i = 0; i < data.length; i++) {
        
        const fila = document.createElement('tr');

        const celda0 = document.createElement('td');
        var check = document.createElement("input");
        check.type = "checkbox";
        check.className = "check";
        check.id = "check-"+data[i].id;
        celda0.appendChild(check);

        const celda1 = document.createElement('td');
        celda1.textContent = data[i].formattedCreatedAt;

        const celda2 = document.createElement('td');
        celda2.textContent = data[i].name;

        const celda3 = document.createElement('td');
        celda3.setAttribute("style","max-width: 300px;")
        var description = document.createElement("p");
        description.textContent = data[i].description;
        celda3.appendChild(description);

        const celda4 = document.createElement('td');
        var select = document.createElement("select");
        select.className = "form-select m-0";
        select.id = "select-"+data[i].id;
        var option1 = document.createElement("option");
        option1.value = 1;
        option1.textContent = "Pendiente";
        data[i].status_id == 1 ? option1.setAttribute("selected","true") : null;
        var option2 = document.createElement("option");
        option2.value = 2;
        option2.textContent = "Realizada";
        data[i].status_id == 2 ? option2.setAttribute("selected","true") : null;
        var option3 = document.createElement("option");
        option3.value = 3;
        option3.textContent = "Cancelado";
        data[i].status_id == 3 ? option3.setAttribute("selected","true") : null;

        select.appendChild(option1);
        select.appendChild(option2);
        select.appendChild(option3);
        celda4.appendChild(select);

        fila.appendChild(celda0);
        fila.appendChild(celda1);
        fila.appendChild(celda2);
        fila.appendChild(celda3);
        fila.appendChild(celda4);
        cuerpo.appendChild(fila);
    }

    // Agrega el encabezado y el cuerpo a la tabla
    table.appendChild(encabezado);
    table.appendChild(cuerpo);

    // Agrega la tabla al contenedor
    tableContainer.appendChild(table);
}

// Función para almacenar una nueva tarea en base de datos
function storeTask() {
    let data = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value
    };
    
    fetch(url + 'api/task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        var table = document.getElementById("table-tasks");
        table.parentNode.removeChild(table);
        getTasks();

        document.getElementById('name').value = "";
        document.getElementById('description').value = "";
        alert(data['response']);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Función para actualizar el estado de todas las tareas
function updateStatus() {
    
    selects = document.getElementsByTagName("select");
    arraySelects = Array.from(selects);

    var data = [];

    arraySelects.forEach(select => {
        let selectId = (select.id).split("-");
        updateData = {
            id: selectId[1],
            status_id: select.value
        };

        data.push(updateData);
    });

    //console.log(JSON.stringify(data));

    fetch(url + 'api/task', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert(data['response']);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Función para eliminar todas las tareas seleccionadas
function deleteTask() {

    checks = document.getElementsByClassName("check");
    arrayChecks = Array.from(checks);
    
    var data = [];

    arrayChecks.forEach(check => {
        if (check.checked) {
            let checkId = (check.id).split("-");
            deleteData = {
                id: checkId[1]
            };
            data.push(deleteData);
        }       
    });

    if (data.length === 0) {
        alert("Selecciona la(s) tarea(s) que quieres eliminar.");
    } else {
        fetch(url + 'api/task', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            var table = document.getElementById("table-tasks");
            table.parentNode.removeChild(table);
            getTasks();

            document.getElementById('name').value = "";
            document.getElementById('description').value = "";

            alert(data['response']);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

// Función para descargar archivo csv con las tareas creadas
function csv(){
        fetch(url + 'api/task/csv') // Reemplaza con la URL correcta de tu endpoint
        .then((response) => {
            // Verificar si la solicitud fue exitosa (código de respuesta 200)
            if (!response.ok) {
                throw new Error('La solicitud falló con el código: ' + response.status);
            }
            return response.blob(); // Convertir la respuesta a un blob
        })
        .then((blob) => {
            // Crear un enlace de descarga
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tareas.csv'; 
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error('Error al descargar el archivo:', error);
        });
}