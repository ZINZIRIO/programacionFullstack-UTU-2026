const url = "https://v2.jokeapi.dev/joke/Any?lang=es";

const $chiste = document.querySelector(".chiste-btn");
const $resultado = document.querySelector("#resultado");

$chiste.addEventListener("click", async () => {
    const response = await fetch(url);
    const data = await response.json();

    if (data.type === "single") {
        $resultado.textContent = data.joke;
    } else {
        $resultado.textContent = `${data.setup} ${data.delivery}`;
    }
});

