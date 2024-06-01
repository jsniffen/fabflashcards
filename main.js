import {cards} from "./cards.js";

let setID = "";
let clazz = "";

document.getElementById("btn-next").onclick = next;
document.getElementById("select-set-id").onchange = e => {
	setID = e.target.value;
};

document.getElementById("select-class").onchange = e => {
	clazz = e.target.value;
};


function getNextCard() {
	const filteredCards = cards.filter(c => {
		let b = true;
		if (setID) {
			b = b && c.set_id == setID;
		}
		if (clazz) {
			b = b && c.types.includes(clazz);
		}
		return b;
	});

	const i = Math.floor(Math.random() * filteredCards.length)
	return filteredCards[i];
}

function next() {
	const card = getNextCard();

	if (card) {
		document.getElementById("card-pitch-blur").hidden = card.pitch == "";
		document.getElementById("card-defense-blur").hidden = card.defense == "";
		console.log(card.power);
		document.getElementById("card-power-blur").hidden = card.power == "";
		// document.getElementById("card-text-blur").hidden = card.power == "";

		document.getElementById("card-image").src = card.image_url;
	}
}


next();
