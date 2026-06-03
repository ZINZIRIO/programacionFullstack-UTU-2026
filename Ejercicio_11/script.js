let formulario = document.getElementById("formulario");
let input = document.getElementById("input-tarea");
let lista = document.getElementById("lista-tareas");
let error = document.getElementById("mensaje-error");

formulario.addEventListener("submit", function(e) {
    e.preventDefault();

    if (input.value == "") {
        error.textContent = "Escribe una tarea";
        return;
    }

    error.textContent = "";

    let tarea = document.createElement("li");
    tarea.textContent = input.value + " ";

    let completar = document.createElement("button");
    completar.textContent = "Completar";

    let eliminar = document.createElement("button");
    eliminar.textContent = "Eliminar";

    completar.onclick = function() {
        tarea.classList.toggle("completada");
        contar();
    }

    eliminar.onclick = function() {
        tarea.remove();
        contar();
    }

    tarea.appendChild(completar);
    tarea.appendChild(eliminar);
    lista.appendChild(tarea);

    input.value = "";
    contar();
});

function contar() {
    let total = document.querySelectorAll("#lista-tareas li").length;
    let completas = document.querySelectorAll(".completada").length;

    document.getElementById("total").textContent = "Total: " + total;
    document.getElementById("completadas").textContent = "Completadas: " + completas;
    document.getElementById("pendientes").textContent = "Pendientes: " + (total - completas);
}

document.getElementById("borrar-todo").onclick = function() {
    lista.innerHTML = "";
    contar();
}

document.getElementById("todas").onclick = function() {
    let tareas = document.querySelectorAll("#lista-tareas li");

    tareas.forEach(function(tarea) {
        tarea.style.display = "list-item";
    });
}

document.getElementById("filtro-completadas").onclick = function() {
    let tareas = document.querySelectorAll("#lista-tareas li");

    tareas.forEach(function(tarea) {
        if (tarea.classList.contains("completada")) {
            tarea.style.display = "list-item";
        } else {
            tarea.style.display = "none";
        }
    });
}

document.getElementById("filtro-pendientes").onclick = function() {
    let tareas = document.querySelectorAll("#lista-tareas li");

    tareas.forEach(function(tarea) {
        if (tarea.classList.contains("completada")) {
            tarea.style.display = "none";
        } else {
            tarea.style.display = "list-item";
        }
    });
}
