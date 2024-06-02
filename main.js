import {cards} from "./scripts/cards.js";

let card = null;
let clazz = "";

document.getElementById("form-submit").onclick = next;
document.getElementById("select-class").onchange = e => {
	clazz = e.target.value;
};

function checkTextAnswer(value, e) {
	if (!e.value) {
		e.setAttribute("aria-invalid", "");
		return;
	}

	if (e.value.toLowerCase() == value.toLowerCase()) {
		e.setAttribute("aria-invalid", "false");
	} else {
		e.setAttribute("aria-invalid", "true");
	}
}

document.getElementById("form-name").onchange = e => checkTextAnswer(card.name, e.target);
document.getElementById("form-cost").onchange = e => checkTextAnswer(card.cost, e.target);
document.getElementById("form-defense").onchange = e => checkTextAnswer(card.defense, e.target);
document.getElementById("form-power").onchange = e => checkTextAnswer(card.power, e.target);

function checkAnswers(card) {
	const name = document.getElementById("form-name");
	const cost = document.getElementById("form-cost");
	const defense = document.getElementById("form-defense");
	const power = document.getElementById("form-power");

	checkTextAnswer(card.name, name);
	checkTextAnswer(card.cost, cost);
	checkTextAnswer(card.defense, defense);
	checkTextAnswer(card.power, power);
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function createOptionElement(card) {
	const e = document.createElement("option");
	e.innerHTML = card.functional_text_plain;
	e.value = card.id;
	return e;
}

function getSimilarCards(card) {
	const filteredCards = cards.filter(c => {
		return c.name != card.name &&
			c.types.sort().join("") == card.types.sort().join("");
	});
	const options = shuffle(filteredCards).slice(0, 2);
	options.push(card);
	return shuffle(options);
}


function getNextCard() {
	const filteredCards = cards.filter(c => {
		return clazz ? c.types.includes(clazz) : true;
	});

	const i = Math.floor(Math.random() * filteredCards.length)
	return filteredCards[i];
}

function next() {
	card = getNextCard();
	console.log(card);

	const formText = document.getElementById("form-text")
	formText.innerHTML = "";
	const options = getSimilarCards(card).map(createOptionElement);
	formText.append(...options);

	if (card) {
		document.getElementById("card-cost-blur").hidden = card.cost == "";
		document.getElementById("card-defense-blur").hidden = card.defense == "";
		document.getElementById("card-power-blur").hidden = card.power == "";
		// document.getElementById("card-text-blur").hidden = card.power == "";

		document.getElementById("card-image").src = card.image_url;

		document.getElementById("form-submit").onclick = () => checkAnswers(card);
	}
}

next();
