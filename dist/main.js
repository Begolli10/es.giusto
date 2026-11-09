"use strict";
// ================== PREZZI ==================
const PREZZO_INTERO = 8.5;
const PREZZO_RIDOTTO = 6.0;
const PREZZO_POPCORN = 4.0; // una sola volta per ordine
const PREZZO_BIBITA = 2.5; // una sola volta per ordine
const PREZZO_OCCHIALI = 1.0; // per ogni biglietto acquistato
const SCONTO = 0.10; // 10% da 5 biglietti in su
const MAX_BIGLIETTI = 8;
// ================== DATI DELLE 4 SALE (un film per sala) ==================
const FILM_1 = "Il ritorno del drago";
const FILM_2 = "Risate in famiglia";
const FILM_3 = "Pianeta rosso";
const FILM_4 = "La casa nel bosco";
// posti liberi in ogni sala
let liberi1 = 40;
let liberi2 = 30;
let liberi3 = 25;
let liberi4 = 10;
// biglietti venduti in ogni sala
let venduti1 = 0;
let venduti2 = 0;
let venduti3 = 0;
let venduti4 = 0;
let incassoTotale = 0;
// ================== ELEMENTI DELLA PAGINA ==================
//REGOLA: <input> → HTMLInputElement, 
//        <select> → HTMLSelectElement, 
//        tutto il resto → HTMLElement
const inputNome = document.getElementById("nome"); // <input type="text">
const inputBiglietti = document.getElementById("biglietti"); // <input type="number">
const radioRidotto = document.getElementById("ridotto"); // <input type="radio">
const selectFilm = document.getElementById("film"); // <select>
const checkPopcorn = document.getElementById("popcorn"); // <input type="checkbox">
const checkBibita = document.getElementById("bibita"); // <input type="checkbox">
const checkOcchiali = document.getElementById("occhiali"); // <input type="checkbox">
const divRisultato = document.getElementById("risultato"); // <div>
// ================== FUNZIONI DI SUPPORTO ==================
// Trasforma un numero in un prezzo, es. 12.5 -> "12,50 €"
function euro(valore) {
    return valore.toFixed(2).replace(".", ",") + " €";
}
// Restituisce il titolo del film proiettato nella sala (1, 2, 3 o 4)
function titoloFilm(sala) {
    switch (sala) {
        case 1:
            return FILM_1;
        case 2:
            return FILM_2;
        case 3:
            return FILM_3;
        default:
            return FILM_4;
    }
}
// Restituisce i posti liberi della sala (1, 2, 3 o 4)
function postiLiberi(sala) {
    switch (sala) {
        case 1:
            return liberi1;
        case 2:
            return liberi2;
        case 3:
            return liberi3;
        default:
            return liberi4;
    }
}
// Registra la vendita: toglie i posti dalla sala, conta i biglietti e aggiorna l'incasso
function registraVendita(sala, numBiglietti, totale) {
    switch (sala) {
        case 1:
            liberi1 = liberi1 - numBiglietti;
            venduti1 = venduti1 + numBiglietti;
            break;
        case 2:
            liberi2 = liberi2 - numBiglietti;
            venduti2 = venduti2 + numBiglietti;
            break;
        case 3:
            liberi3 = liberi3 - numBiglietti;
            venduti3 = venduti3 + numBiglietti;
            break;
        default:
            liberi4 = liberi4 - numBiglietti;
            venduti4 = venduti4 + numBiglietti;
    }
    incassoTotale = incassoTotale + totale;
}
function calcolaTotale(numBiglietti, ridotto, popcorn, bibita, occhiali) {
    let totale;
    if (ridotto) {
        totale = numBiglietti * PREZZO_RIDOTTO;
    }
    else {
        totale = numBiglietti * PREZZO_INTERO;
    }
    if (popcorn) {
        totale = totale + PREZZO_POPCORN;
    }
    if (bibita) {
        totale = totale + PREZZO_BIBITA;
    }
    if (occhiali) {
        totale = totale + numBiglietti * PREZZO_OCCHIALI;
    }
    if (numBiglietti >= 5) {
        totale = totale - totale * SCONTO;
    }
    return Math.round(totale * 100) / 100; // arrotondo ai centesimi
}
// ================== PULSANTE "RIEPILOGO ORDINE" ==================
// Controlla i dati, verifica i posti, registra la vendita e mostra il riepilogo
function mostraRiepilogo() {
    let nome = inputNome.value.trim();
    let numBiglietti = Number(inputBiglietti.value);
    let sala = Number(selectFilm.value);
    let ridotto = radioRidotto.checked;
    // 1) controlli sui dati inseriti
    if (nome === "") {
        divRisultato.className = "errore"; // "ok" oppure "errore"
        divRisultato.textContent = "Errore: inserisci il nome del cliente.";
        return;
    }
    if (isNaN(numBiglietti) || !Number.isInteger(numBiglietti) || numBiglietti < 1 || numBiglietti > MAX_BIGLIETTI) {
        divRisultato.className = "errore"; // "ok" oppure "errore"
        divRisultato.textContent = "Errore: il numero di biglietti deve essere tra 1 e " + MAX_BIGLIETTI + ".";
        return;
    }
    // 2) controllo dei posti liberi: se non bastano, la vendita NON viene registrata
    if (numBiglietti > postiLiberi(sala)) {
        divRisultato.className = "errore"; // "ok" oppure "errore"
        divRisultato.textContent = "Errore: nella sala " + sala + " restano solo " + postiLiberi(sala) +
            " posti liberi. Vendita non registrata.";
        return;
    }
    // 3) calcolo del totale e registrazione della vendita
    let totale = calcolaTotale(numBiglietti, ridotto, checkPopcorn.checked, checkBibita.checked, checkOcchiali.checked);
    registraVendita(sala, numBiglietti, totale);
    // 4) riepilogo
    let testo = "RIEPILOGO ORDINE\n";
    testo += "Cliente: " + nome + "\n";
    testo += "Film: " + titoloFilm(sala) + " (sala " + sala + ")\n";
    if (ridotto) {
        testo += "Biglietti: " + numBiglietti + " ridotti\n";
    }
    else {
        testo += "Biglietti: " + numBiglietti + " interi\n";
    }
    if (numBiglietti >= 5) {
        testo += "Sconto del 10% applicato\n";
    }
    testo += "Totale da pagare: " + euro(totale);
    divRisultato.className = "ok"; // "ok" oppure "errore"
    divRisultato.textContent = testo;
}
// ================== PULSANTE "SINTESI DELLA GIORNATA" ==================
function mostraSintesi() {
    let testo = "SINTESI DELLA GIORNATA\n\n";
    testo += "Posti liberi:\n";
    testo += "Sala 1 (" + FILM_1 + "): " + liberi1 + "\n";
    testo += "Sala 2 (" + FILM_2 + "): " + liberi2 + "\n";
    testo += "Sala 3 (" + FILM_3 + "): " + liberi3 + "\n";
    testo += "Sala 4 (" + FILM_4 + "): " + liberi4 + "\n";
    testo += "\nIncasso totale: " + euro(incassoTotale) + "\n";
    // film che ha venduto più biglietti: parto dalla sala 1 e confronto con le altre
    let maxVenduti = venduti1;
    let filmPiuVenduto = FILM_1;
    if (venduti2 > maxVenduti) {
        maxVenduti = venduti2;
        filmPiuVenduto = FILM_2;
    }
    if (venduti3 > maxVenduti) {
        maxVenduti = venduti3;
        filmPiuVenduto = FILM_3;
    }
    if (venduti4 > maxVenduti) {
        maxVenduti = venduti4;
        filmPiuVenduto = FILM_4;
    }
    if (maxVenduti === 0) {
        testo += "Film più venduto: nessun biglietto venduto";
    }
    else {
        testo += "Film più venduto: " + filmPiuVenduto + " (" + maxVenduti + " biglietti)";
    }
    divRisultato.className = "ok"; // "ok" oppure "errore"
    divRisultato.textContent = testo;
}
//# sourceMappingURL=main.js.map