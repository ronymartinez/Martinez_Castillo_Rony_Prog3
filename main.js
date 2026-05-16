import { Carta } from "./carta.js";

var urlApi = "https://deckofcardsapi.com/api/deck/new/draw/?count=50";
var contadorIndex = 0;
var contadorGuardados = 0;
var contenedorCartas;
var listaGuardados;

if (localStorage.getItem("listaGuardados") == null) {
    localStorage.setItem("listaGuardados", JSON.stringify([]));
}

if (localStorage.getItem("listaTotal") == null) {
    localStorage.setItem("listaTotal", JSON.stringify([]));
}

document.addEventListener("DOMContentLoaded", async () => {

    contenedorCartas = $("cartas");

    let listaTotal = JSON.parse(localStorage.getItem("listaTotal"));

    if (listaTotal.length == 0) {
        listaTotal = await ObtenerCartasDeApi();
    }

    if (document.body.id == "body_index") {
        CargarCartasIndex();
    }

    if (document.body.id == "body_guardados") {
        CargarCartasGuardadas();
        InicializarEventosGuardados();
    }

    InicializarEventosGlobales();
});

function ObtenerCartasDeJson(json) {
    let listaCartas = [];
    json.forEach(carta => {
        listaCartas.push(new Carta(carta.code, carta.value, carta.suit, carta.image));
    });
    return listaCartas;
}

async function ObtenerCartasDeApi() {

    let listaTotal = [];

    try {
        let response = await fetch(urlApi);

        if (!response.ok) {
            return [];
        }

        let data = await response.json();

        if (data && data.cards && data.cards.length > 0) {

            data.cards.forEach(c => {
                let nueva = new Carta(c.code, c.value, c.suit, c.image);
                listaTotal.push(nueva.toJsonString());
            });
        }

    } catch (error) {
        console.error("Error:", error);
    }

    localStorage.setItem("listaTotal", JSON.stringify(listaTotal));
    return listaTotal;
}

async function CargarCartasIndex() {

    contenedorCartas.innerHTML = "";

    let listaTotal = JSON.parse(localStorage.getItem("listaTotal"));
    let cartas = [];

    for (let i = contadorIndex; i < contadorIndex + 6 && i < listaTotal.length; i++) {
        let carta = Carta.createFromJsonString(listaTotal[i]);
        cartas.push(carta);
    }

    if (cartas.length < 6) {

        contenedorCartas.innerHTML = "";

        let mensaje = document.createElement("p");
        mensaje.textContent = "No hay más cartas para mostrar";
        mensaje.classList.add("mensaje-fin");

        contenedorCartas.appendChild(mensaje);

        $("siguiente").disabled = true;
        return;
    }

    cartas.forEach(carta => {
        contenedorCartas.appendChild(carta.CreateHtmlElement("index"));
    });

    $("siguiente").disabled = false;
}

async function CargarCartasGuardadas() {
    contadorGuardados = 0;
    contenedorCartas.innerHTML = "";

    listaGuardados = localStorage.getItem("listaGuardados");
    console.log("Cargas guardadas ", listaGuardados);

    if (listaGuardados != null) {
        listaGuardados = JSON.parse(listaGuardados);
    } else {
        listaGuardados = [];
    }

    if (listaGuardados.length == 0) {
        contenedorCartas.textContent = "No hay cartas guardadas";
        return;
    }

    for (let i = contadorGuardados; i < contadorGuardados + 6 && i < listaGuardados.length; i++) {
        try {
            let carta = Carta.createFromJsonString(listaGuardados[i]);
            contenedorCartas.appendChild(carta.CreateHtmlElement("guardados"));
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

function InicializarEventosGlobales() {

    if ($("siguiente")) {
        $("siguiente").addEventListener("click", () => {

            if (document.body.id == "body_index") {

                let listaTotal = JSON.parse(localStorage.getItem("listaTotal"));

                if (contadorIndex + 6 < listaTotal.length) {
                    contadorIndex += 6;
                    CargarCartasIndex();
                }

                if (contadorIndex + 6 >= listaTotal.length) {
                    $("siguiente").disabled = true;
                }
            }

            if (document.body.id == "body_guardados") {

                let data = localStorage.getItem("listaGuardados");

                if (data != null) {
                    listaGuardados = JSON.parse(data);
                } else {
                    listaGuardados = [];
                }

                if (contadorGuardados + 6 < listaGuardados.length) {
                    contadorGuardados += 6;
                    CargarCartasGuardadas();
                }

                if (contadorGuardados + 6 >= listaGuardados.length) {
                    $("siguiente").disabled = true;
                }
            }
        });
    }

    if ($("anterior")) {
        $("anterior").addEventListener("click", () => {

            if (document.body.id == "body_index") {

                if (contadorIndex > 0) {
                    contadorIndex -= 6;
                    if (contadorIndex < 0) {
                        contadorIndex = 0;
                    }
                    CargarCartasIndex();
                    $("siguiente").disabled = false;
                }
            }

            if (document.body.id == "body_guardados") {

                if (contadorGuardados > 0) {
                    contadorGuardados -= 6;
                    if (contadorGuardados < 0) {
                        contadorGuardados = 0;
                    }
                    CargarCartasGuardadas();
                    $("siguiente").disabled = false;
                }
            }
        });
    }
}

function InicializarEventosGuardados() {

    if ($("ordenarsuit")) {
        $("ordenarsuit").addEventListener("click", () => {

            if (listaGuardados.length > 0) {

                listaGuardados.sort((a, b) => {
                    let cartaA = Carta.createFromJsonString(a);
                    let cartaB = Carta.createFromJsonString(b);
                    return cartaA.suit.localeCompare(cartaB.suit);
                });

                localStorage.setItem("listaGuardados", JSON.stringify(listaGuardados));

                contadorGuardados = 0; 

                CargarCartasGuardadas();
            }
        });
    }
}

function $(id) {
    return document.getElementById(id);
}