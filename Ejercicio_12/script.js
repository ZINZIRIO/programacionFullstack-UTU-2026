// Entradas
const $nombre = document.querySelector(".nombre");
const $descripcion = document.querySelector(".descripcion");
const $categorias = document.querySelector(".categorias");
const $estados = document.querySelector(".estados");
const $url = document.querySelector(".url");
const $cantidad_img = document.querySelector(".cantidad");
const $error = document.querySelector(".error");
const $agregar = document.querySelector(".agregar");
const $tarjetas_contenedor = document.querySelector(".tarjetas");
const $contador = document.querySelector(".contador");
const $estados_value = document.querySelectorAll(".opcion");
const $categoria_value = document.querySelector(".categorias");
const $fav = document.querySelector(".favoritos");
const $no_fav = document.querySelector(".no-favoritas");
const $calificacion = document.querySelector(".calificacion");

// Filtros
const $btn_todos = document.querySelector(".btn-todos");
const $btn_videojuegos = document.querySelector(".btn-videojuegos");
const $btn_peliculas = document.querySelector(".btn-peliculas");
const $btn_series = document.querySelector(".btn-series");
const $btn_favoritos = document.querySelector(".btn-favoritos");
const $btn_pendientes = document.querySelector(".btn-pendientes");
const $btn_en_progreso = document.querySelector(".btn-en-progreso");
const $btn_terminados = document.querySelector(".btn-terminados");

// Cambiar modo
const $cambiar_modo = document.querySelector(".cambiar-modo"); 

let total_imgs = 0;
let fav_imgs = 0;
let no_fav_imgs = 0;

$agregar.addEventListener('click', function(event){

    const resultado = validar_cantidad($calificacion, $error);

    event.preventDefault();

    // Validacion

    if($nombre.value.trim() !== "" && $descripcion.value.trim() !== "" && $url.value.trim() !== "" && $cantidad_img.value.trim() !== "" && resultado){
        
        // Limpiar el error
        $error.textContent = "";
        $error.classList.remove("error-style");

          
        // Crear la tarjeta
        for(let i = 0; i < $cantidad_img.value; i++){
            const $card = crear_tarjeta($nombre, $descripcion, $url, $estados, $categoria_value, $calificacion);

            

            total_imgs++;

            console.log("Agregados: " + total_imgs);

            $contador.textContent = total_imgs; 
        
        
           

            // Seleccionar el boton
            const $btn_eliminar = $card.querySelector(".btn_eliminar");


            // Funcion Eliminar
            $btn_eliminar.addEventListener('click', function(){
                total_imgs = eliminar_tarjeta($card, total_imgs, $contador);

                if($favorito_boton.classList.contains("imagenes-fav")){
                    fav_imgs--;
                }

                no_fav_imgs = total_imgs - fav_imgs;
                $no_fav.textContent = no_fav_imgs;
                $total.textContent = total_imgs;
                $fav.textContent = fav_imgs;
            })

            const $btn_estado = $card.querySelector(".btn_estado");


            // Funcion Cambiar Estado
            $btn_estado.addEventListener('click', function(){
                const $estado = $card.querySelector(".estado_actual"); 
                cambiar_estado($estados_value, $estado);           
            })

            // Estilos de titulo
            const $btn_title = $card.querySelector(".btn-nombre");

            $btn_title.addEventListener('click', function(event){
                event.preventDefault();
                $btn_title.classList.toggle("titulo-style");
            })

            // Estilos de favorito
            const $favorito_boton = $card.querySelector(".favorito-style");

            $favorito_boton.addEventListener('click', function(){
            $favorito_boton.classList.toggle("imagenes-fav");
            console.log($favorito_boton.className);

            if($favorito_boton.classList.contains("imagenes-fav")){
                fav_imgs++;
            }else if(fav_imgs > 0){
                fav_imgs--;
            }
          
            no_fav_imgs = total_imgs - fav_imgs;

            $fav.textContent = fav_imgs;
            $no_fav.textContent = no_fav_imgs;
        });
            
        }   
        
        limpiar_formulario($nombre, $descripcion, $url, $cantidad_img, $calificacion);
        
    }else if(resultado){
        $error.textContent = "Asegurese de tener todos los campos rellenados! Intentelo de nuevo."
        $error.classList.add("error-style");
    }

})


function crear_tarjeta($nombre, $descripcion, $url, $estados, $categoria, $calificacion){
    const $card = document.createElement("div");


    $card.innerHTML = `
    <button class="btn-nombre"> ${$nombre.value} </button>
    <p> ${$descripcion.value} </p>
    <img src="${$url.value}">
    <p> Estado: <span class="estado_actual">${$estados.value}</span><p>
    <p> Categoria: <span class="tipo">${$categoria.value}<span></p>
    <p> Calificacion: <span> ${$calificacion.value}/5 <span></p>
    <section class="opciones">
        <button class="btn_estado">Cambiar Estado</button>
        <button class="btn_eliminar">Eliminar</button>
        <button class="favorito-style"><i class="fa-solid fa-star"></i></button>
    </section>

    `;

    $card.classList.add("card-style");

    $tarjetas_contenedor.appendChild($card);

    return $card;
}



function limpiar_formulario($nombre, $descripcion, $url, $cantidad_img, $calificacion){

    console.log("Limpiando formulario.")
    $nombre.value = "";
    $descripcion.value = "";
    $url.value = "";
    $cantidad_img.value = "";
    $calificacion.value = "";

}


function validar_cantidad($cantidad_img, $error){
    // console.log($cantidad_img.value);
    if($cantidad_img.value < 1 || $cantidad_img.value > 5){
        $error.textContent = "La calificacion tiene que ser entre 1 y 5. Verifique!";
        $error.classList.add("error-style");

        return false;
    }else{
        $error.textContent = "";
        $error.classList.remove("error-style");
        return true;
    }
}



function eliminar_tarjeta($card, total_imgs, $contador){
    total_imgs--;
    $contador.textContent = total_imgs;
    console.log("Imagenes totales: " + total_imgs)
    $card.remove();
    return total_imgs;
}

function cambiar_estado($estados, $estado_card){
    let estados = [];

    $estados.forEach(opcion => {
        estados.push(opcion.value);
    });

    console.log($estado_card);
    
  
    for(let i = 0; i < estados.length; i++){
        // DEBUG
        // console.log(estados[i]);

        if(estados[i] == $estado_card.textContent && i != 2){
            $estado_card.textContent = estados[i+1];
            break;
        }else if(i == 2){
            $estado_card.textContent = estados[0];
            break;
        }
    }

}

$btn_todos.addEventListener('click', function(event){
    event.preventDefault();

    const $tarjetas = document.querySelectorAll(".card-style");

    $tarjetas.forEach(tarjeta => {
        tarjeta.style.display = "block";
    })
})

$btn_series.addEventListener('click', function(event){
    filtrar_por_categoria('serie', event, 'tipo');   
})

$btn_peliculas.addEventListener('click', function(event){
    filtrar_por_categoria('peliculas', event, 'tipo');
})

$btn_videojuegos.addEventListener('click', function(event){
    filtrar_por_categoria('videojuegos', event, 'tipo');
})

$btn_pendientes.addEventListener('click', function(event){
    filtrar_por_categoria('pendiente', event, 'estado_actual');
})

$btn_en_progreso.addEventListener('click', function(event){
    filtrar_por_categoria('jugando', event, 'estado_actual');
})

$btn_terminados.addEventListener('click', function(event){
    filtrar_por_categoria('terminado', event, 'estado_actual');
})

$btn_favoritos.addEventListener('click', function(event){
    event.preventDefault();

    const tarjetas = document.querySelectorAll(".card-style");

    tarjetas.forEach(tarjeta => {

        const favorito = tarjeta.querySelector(".favorito-style");

        if(favorito.classList.contains("imagenes-fav")){
            tarjeta.style.display = "block";
        }else{
            tarjeta.style.display = "none";
        }

    });
});

$cambiar_modo.addEventListener('click', function(event){

    event.preventDefault();

    const $formulario = document.querySelector(".container-form");

    $formulario.classList.toggle("dark");
})




function filtrar_por_categoria(categoria_seleccionada, event, categoria_buscar){
    event.preventDefault();

    const tarjetas = document.querySelectorAll(".card-style");

    tarjetas.forEach(tarjeta => {
        const categoria = tarjeta.querySelector("." + categoria_buscar);
        console.log("Tipo: " + categoria.textContent);

        if(categoria.textContent === categoria_seleccionada){
            tarjeta.style.display = "block";
        }else{
            tarjeta.style.display = "none";
        }
    })
}