// APY KEY
const API_KEY = "live_BM7aZwtZka5TI348v50EVqVtbX2fYJ0OoniVGvbGWpvN657f3SUvWTnC02bSLBxz";
const URL_IMAGEN = "https://api.thecatapi.com/v1/images/search";
const URL_VOTOS = "https://api.thecatapi.com/v1/votes";

// HTML
const btnGato = document.getElementById("btn-gato");
const catImage = document.getElementById("catImage");

const btnLike = document.getElementById("btnlike");
const btnDislike = document.getElementById("btnDislike");

const likeCount = document.getElementById("likesCount");
const dislikeCount = document.getElementById("dislikesCount");

const error = document.getElementById("error");


let contadorLikes = 0;
let contadorDislikes = 0;
let currentImageId = null;

// TRAER GATO
async function traerGato(borrarMensaje = true) {
    try {
        if (borrarMensaje) {
            error.textContent = "";
        }

        const response = await fetch(URL_IMAGEN);
        if (!response.ok) {
            throw new Error("No se pudo obtener la imagen del Gato");
        }

        const datos = await response.json();
        catImage.src = datos[0].url;
        currentImageId = datos[0].id;

    } catch (err) {
        error.textContent = err.message;
    }
}

// VOTACIONES
async function votarGato(value) {
    if (!currentImageId) {
        error.textContent = "Primero debes cargar una imagen de un gato.";
        return;
    }

    try {
        error.textContent = "";

        const response = await fetch(URL_VOTOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY
            },
            body: JSON.stringify({
                image_id: currentImageId,
                value: value
            })
        });

        if (!response.ok) {
            throw new Error("No se pudo enviar el voto");
        }

        const datos = await response.json();
        console.log("Voto enviado:", datos);

        if (value === 1) {
            contadorLikes++;
            likeCount.textContent = contadorLikes;
        } else {
            contadorDislikes++;
            dislikeCount.textContent = contadorDislikes;
        }

        error.textContent = "Voto registrado correctamente.";
        await traerGato(false);

    } catch (err) {
        error.textContent = err.message;
    }
}

btnGato.addEventListener("click", traerGato);

btnLike.addEventListener("click", () => {
    votarGato(1);
});

btnDislike.addEventListener("click", () => {
    votarGato(-1);
});
