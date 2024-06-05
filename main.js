import {cards} from "./scripts/cards.js";

let isAnswersShown = false;
let shuffledCards = null;
let currentCardIndex = 0;
let correctCount = 0;

const dialogEnd = document.getElementById("dialog-end");
const blurCost = document.getElementById("blur-cost")
const blurDefense = document.getElementById("blur-defense")
const blurName = document.getElementById("blur-name")
const blurPower = document.getElementById("blur-power")
const blurText = document.getElementById("blur-text")

const btnReset = document.getElementById("btn-reset");
const btnCheckAnswer = document.getElementById("btn-check-answer");
const btnShowAnswer = document.getElementById("btn-show-answer");
const btnSkip = document.getElementById("btn-skip");
const selectClazz = document.getElementById("select-clazz");
const cardImage = document.getElementById("card-image");

const btnPlayAgain = document.getElementById("btn-play-again");
btnPlayAgain.onclick = () => {
	dialogEnd.removeAttribute("open");
	reset();
};

cardImage.onload = () => {
	resizeBlurs();
}

const score = document.getElementById("score");
const count = document.getElementById("count");

const cardNameDropdown = document.getElementById("card-name-dropdown");
const cardNameInput = document.getElementById("card-name-input");
const cardTextDropdown = document.getElementById("card-text-dropdown");
const cardTextInput = document.getElementById("card-text-input");
const cardCostInput = document.getElementById("card-cost-input");
const cardDefenseInput = document.getElementById("card-defense-input");
const cardPowerInput = document.getElementById("card-power-input");

const cardNames = new Set(cards.map(c => c.name));
const cardNameSearchIndex = new Fuse(Array.from(cardNames), {includeScore: true, threshold: 0.35, ignoreLocation: true});
const cardText = new Set(cards.map(c => c.functional_text_plain));
const cardTextSearchIndex = new Fuse(Array.from(cardText), {includeScore: true, threshold: 0.9, ignoreLocation: true});

cardNameInput.onkeydown = e => searchOnKeyDown(e, cardNameDropdown);
cardNameInput.oninput = e => searchOnInput(e, cardNameDropdown, cardNameSearchIndex);

cardTextInput.onkeydown = e => searchOnKeyDown(e, cardTextDropdown);
cardTextInput.oninput = e => searchOnInput(e, cardTextDropdown, cardTextSearchIndex);

document.onclick = e => {
	cardTextDropdown.hidden = true;
	cardNameDropdown.hidden = true;
};

function searchOnKeyDown(e, dropdown) {
	if (e.key == "Tab" || e.key == "Escape") {
		dropdown.hidden = true;
		return;
	}

	let selectedIdx = parseInt(dropdown.getAttribute("selected-idx"));
	if (e.key == "Enter") {
		// e.stopPropagation();

		if (selectedIdx >= 0 && selectedIdx <= dropdown.children.length) {
			e.target.value = dropdown.children[selectedIdx].textContent;
		}

		dropdown.hidden = true;
		return;
	}

	let newSelectedIdx = null;
	if (e.key == "ArrowDown" && selectedIdx < dropdown.children.length - 1) {
		newSelectedIdx = selectedIdx + 1;
	}
	
	if (e.key == "ArrowUp" && selectedIdx > 0) {
		newSelectedIdx = selectedIdx - 1;
	}

	if (newSelectedIdx != null) {
		dropdown.setAttribute("selected-idx", newSelectedIdx);
		Array.from(dropdown.children).forEach((e, i) => {
			if (i == newSelectedIdx) {
				e.classList.add("selected");
			} else {
				e.classList.remove("selected");
			}
		});
	}
}

function searchOnInput(e, dropdown, searchIndex) {
	// Handle enter key for textarea elements.
	if (e.inputType == "insertLineBreak") {
		return;
	}

	dropdown.setAttribute("selected-idx", -1);

	const lis = searchIndex
		.search(e.target.value)
		.map(c => c.item)
		.slice(0, 5)
		.map((name, i) => createDropdownLi(i, e.target, dropdown, name, -1));

	if (lis.length == 0) {
		dropdown.hidden = true;
	} else {
		dropdown.innerHTML = "";
		dropdown.append(...lis);
		dropdown.hidden = false;
	}
}

function createDropdownLi(i, input, ul, text, selectedIdx) {
	const li = document.createElement("li");
	li.innerHTML = text;

	if (i == selectedIdx) {
		li.classList.add("selected");
	}

	li.onclick = () => {
		input.value = text;
		ul.hidden = true;
	}

	return li;
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function reset() {
	const clazz = selectClazz.value;
	if (clazz == "All") {
		shuffledCards = cards;
	} else {
		shuffledCards = cards.filter(card => card.types.includes(clazz));
	}

	correctCount = 0;

	shuffledCards = shuffle(shuffledCards);
	currentCardIndex = 0;
	count.textContent = `${currentCardIndex+1}/${shuffledCards.length}`;

	showCard();
}

function next() {
	currentCardIndex++;
	count.textContent = `${currentCardIndex+1}/${shuffledCards.length}`;
}

function showCard() {
	const card = shuffledCards[currentCardIndex];
	cardImage.src = `https://storage.googleapis.com/fabflashcards/assets/${card.id}.png`

	isAnswersShown = false;

	cardNameInput.setAttribute("aria-invalid", "");
	cardNameInput.value = "";
	cardNameInput.disabled = card.name == "";

	cardTextInput.setAttribute("aria-invalid", "");
	cardTextInput.value = "";
	cardTextInput.disabled = card.functional_text_plain == "";

	cardCostInput.setAttribute("aria-invalid", "");
	cardCostInput.value = "";
	cardCostInput.disabled = card.cost == "";

	cardDefenseInput.setAttribute("aria-invalid", "");
	cardDefenseInput.value = "";
	cardDefenseInput.disabled = card.defense == "";

	cardPowerInput.setAttribute("aria-invalid", "");
	cardPowerInput.value = "";
	cardPowerInput.disabled = card.power == "";

	cardNameInput.focus();
}

function showAnswers() {
	Array.from(document.getElementsByClassName("blur")).forEach(e => {
		e.hidden = true;
	});
	isAnswersShown = true;
}

btnReset.onclick = reset;
btnSkip.onclick = () => skip();
btnCheckAnswer.onclick = () => checkAnswers();
btnShowAnswer.onclick = showAnswers;

function skip() {
	if (currentCardIndex >= shuffledCards.length - 1) {
		gameEnd();
		return;
	}

	next();
	showCard();
}

function checkAnswers() {
	const card = shuffledCards[currentCardIndex];

	let correct = true;

	if (card.name) {
		const nameCorrect = cardNameInput.value.trim().toLowerCase() == card.name.toLowerCase();
		cardNameInput.setAttribute("aria-invalid", !nameCorrect);
		if (nameCorrect) {
			blurName.hidden = true;
		}
		correct = correct && nameCorrect;
	}

	if (card.functional_text_plain) {
		const textCorrect = cardTextInput.value.trim().toLowerCase() == card.functional_text_plain.toLowerCase();
		console.log(cardTextInput.value, card.functional_text_plain);
		cardTextInput.setAttribute("aria-invalid", !textCorrect);
		if (textCorrect) {
			blurText.hidden = true;
		}
		correct = correct && textCorrect;
	}

	if (card.cost) {
		const costCorrect = cardCostInput.value.trim() == card.cost;
		cardCostInput.setAttribute("aria-invalid", !costCorrect);
		if (costCorrect) {
			blurCost.hidden = true;
		}
		correct = correct && costCorrect;
	}

	if (card.defense) {
		const defenseCorrect = cardDefenseInput.value.trim() == card.defense;
		cardDefenseInput.setAttribute("aria-invalid", !defenseCorrect);
		if (defenseCorrect) {
			blurDefense.hidden = true;
		}
		correct = correct && defenseCorrect;
	}

	if (card.power) {
		const powerCorrect = cardPowerInput.value.trim() == card.power;
		cardPowerInput.setAttribute("aria-invalid", !powerCorrect);
		if (powerCorrect) {
			blurPower.hidden = true;
		}
		correct = correct && powerCorrect;
	}

	if (correct) {
		correctCount += 1
		score.textContent = `${correctCount}/${shuffledCards.length} Correct`;

		setTimeout(() => skip(), 1000);
	}
}

function resizeBlurs() {
	const card = shuffledCards[currentCardIndex];

	if (!isAnswersShown) {
		if (cardCostInput.getAttribute("aria-invalid") != "false") {
			blurCost.hidden = card.cost == "";
		}
		if (cardNameInput.getAttribute("aria-invalid") != "false") {
			blurName.hidden = card.name == "";
		}
		if (cardTextInput.getAttribute("aria-invalid") != "false") {
			blurText.hidden = card.functional_text_plain == "";
		}
		if (cardDefenseInput.getAttribute("aria-invalid") != "false") {
			blurDefense.hidden = card.defense == "";
		}
		if (cardPowerInput.getAttribute("aria-invalid") != "false") {
			blurPower.hidden = card.power == "";
		}
	}

	const cardHeight = cardImage.offsetHeight;
	const cardWidth = cardImage.offsetWidth;

	blurCost.style.width = cardWidth/6.5 + "px";
	blurCost.style.height = cardWidth/6.5 + "px"
	blurCost.style.top = cardImage.offsetTop + cardHeight/30 + "px";
	blurCost.style.left = cardImage.offsetLeft + cardWidth/1.25 + "px";

	blurName.style.width = cardWidth/1.5 + "px";
	blurName.style.height = cardHeight/16 + "px";
	blurName.style.top = cardImage.offsetTop + cardHeight/18 + "px";
	blurName.style.left = cardImage.offsetLeft + cardWidth/6 + "px";

	blurText.style.width = cardWidth/1.2 + "px";
	blurText.style.height = cardHeight/3.4 + "px";
	blurText.style.top = cardImage.offsetTop + cardHeight/1.7 + "px";
	blurText.style.left = cardImage.offsetLeft + cardWidth/12.5 + "px";

	blurDefense.style.width = cardHeight/17 + "px";
	blurDefense.style.height = cardHeight/17 + "px"
	blurDefense.style.top = cardImage.offsetTop + cardHeight/1.135 + "px";
	blurDefense.style.left = cardImage.offsetLeft + cardWidth/1.27 + "px";

	blurPower.style.width = cardHeight/17 + "px";
	blurPower.style.height = cardHeight/17 + "px"
	blurPower.style.top = cardImage.offsetTop + cardHeight/1.135 + "px";
	blurPower.style.left = cardImage.offsetLeft + cardWidth/7.68 + "px";
}

function gameEnd() {
	score.textContent = `You guessed ${correctCount}/${shuffledCards.length} correctly!`
	dialogEnd.setAttribute("open", "");
}

window.addEventListener("resize", e => {
	resizeBlurs();
});

reset();
