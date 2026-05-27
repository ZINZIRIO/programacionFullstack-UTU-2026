function cambiarTexto() {
    document.getElementById("titulo").textContent = "Texto cambiado";
}

function cambiarParrafo() {
    document.getElementById("parrafo").innerHTML = "Parrafo cambiado con <b>innerHTML</b>";
}

function cambiarImagen() {
    document.getElementById("imagen").src = "https://moto-sticker.com/assets/motostickerold/img/products/1561/image/Kawasaki-zx6r-2013-ninja-green-complete-decal-set.jpg";
}

function mostrarMensaje() {
    let dato = document.getElementById("dato").value;
    alert(dato);
}

function agregarClase() {
    document.getElementById("texto").classList.add("destacado");
}

function quitarClase() {
    document.getElementById("texto").classList.remove("destacado");
}

function modoOscuro() {
    document.body.classList.toggle("modo-oscuro");
}

function agregarElemento() {
    let texto = document.getElementById("item").value;

    if (texto !== "") {
        let li = document.createElement("li");
        li.textContent = texto;
        document.getElementById("lista").appendChild(li);
        document.getElementById("item").value = "";
    }
}



function enviarFormulario() {
    let nombre = document.getElementById("nombre").value;
    let color = document.getElementById("color").value;
    let mensaje = document.getElementById("mensaje").value;

    
    document.getElementById("error-nombre").textContent = "";
    document.getElementById("error-color").textContent = "";
    document.getElementById("error-mensaje").textContent = "";

    
    if (nombre === "") {
        document.getElementById("error-nombre").textContent = "Escribe tu nombre";
        return;
    }

    
    if (color === "") {
        document.getElementById("error-color").textContent = "Escribe tu color favorito";
        return;
    }

    
    if (mensaje === "") {
        document.getElementById("error-mensaje").textContent = "Escribe un mensaje";
        return;
    }

    
    document.getElementById("resultado").innerHTML =
        "<p>Nombre: " + nombre + "</p>" +
        "<p>Color favorito: " + color + "</p>" +
        "<p>Mensaje: " + mensaje + "</p>";

    
        document.getElementById("titulo").style.color = color;

    
        let tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
    tarjeta.innerHTML =
        "<h4>" + nombre + "</h4>" +
        "<p>Color: " + color + "</p>" +
        "<p>" + mensaje + "</p>";

    
    document.getElementById("tarjetas").appendChild(tarjeta);

    document.getElementById("nombre").value = "";
    document.getElementById("color").value = "";
    document.getElementById("mensaje").value = "";
}
