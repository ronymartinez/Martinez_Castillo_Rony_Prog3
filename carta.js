export class Carta {
    code;
    value;
    suit;
    image;

    constructor(code, value, suit, image) {
        this.code = code;
        this.value = value;
        this.suit = suit;
        this.image = image;
    }

    toJsonString() {
        return JSON.stringify({
            code: this.code,
            value: this.value,
            suit: this.suit,
            image: this.image,
        });
    }

    static createFromJsonString(json) {
        let data = JSON.parse(json);
        return new Carta(
            data.code,
            data.value,
            data.suit,
            data.image,
        );
    }

    CreateHtmlElement(modo) {
        let div = document.createElement("div");
        div.classList.add("carta");

        let titulo = document.createElement("h6");
        titulo.textContent = 'Suit: ' + this.suit;

        let valor = document.createElement("p");
        valor.textContent = 'Value: ' + this.value;

        let codigo = document.createElement("p");
        codigo.textContent = 'Code: ' + this.code;

        let img = document.createElement("img");
        img.src = this.image;
        img.style.width = "50%";

        img.addEventListener("click", () => {
            window.open(this.image, "_blank");
        });

        div.appendChild(codigo);
        div.appendChild(titulo);
        div.appendChild(valor);
        div.appendChild(img);

        if (modo === "index") {
            let boton = document.createElement("button");
            boton.textContent = "Guardar";

            boton.addEventListener("click", () => {
                Carta.GuardarCarta(this);
            });

            div.appendChild(boton);
        }       

        return div;""
    }

    static GuardarCarta(carta) {
        let lista = [];
        let data = localStorage.getItem("listaGuardados");
        if (data != null) {
            lista = JSON.parse(data);
        }

        lista.push(carta.toJsonString()); 
        localStorage.setItem("listaGuardados", JSON.stringify(lista));

        alert("Carta guardada");
    }
}