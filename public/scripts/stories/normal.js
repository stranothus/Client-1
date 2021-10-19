function shortStoryCard(image, title, preview, index) {
	let cardElement = document.createElement("a");

	cardElement.href = "/short-story/" + title;

	cardElement.classList.add("book-card");

	cardElement.innerHTML = `
		<img src = "${image}">
		<div class = "title">${title}</div>`;

	let previewElement = document.createElement("div");

	previewElement.classList.add("preview");

	previewElement.textContent = preview;

	cardElement.appendChild(previewElement);

	return cardElement;
}

function quickWriteCard(image, title, preview, index) {
	let cardElement = document.createElement("a");

	cardElement.href = "/quick-write/" + title;

	cardElement.classList.add("writing-card");

	cardElement.innerHTML = `
		<img src = "${image}">`;

	let previewElement = document.createElement("div");

	previewElement.classList.add("preview");

	previewElement.innerHTML = `<h4>${title}</h4><p>${document.createTextNode(preview).textContent}</p>`;

	cardElement.appendChild(previewElement);

	return cardElement;
}

function recentCard(image, title, preview, index) {
	let cardElement = document.createElement("a");

	cardElement.href = "/quick-write/" + title;

	cardElement.classList.add("recent-writing-card");

	cardElement.innerHTML = `
		<img src = "${image}">`;

	let previewElement = document.createElement("div");

	previewElement.classList.add("preview");

	previewElement.innerHTML = `<h4>${title}</h4><p>${document.createTextNode(preview).textContent}</p>`;

	cardElement.appendChild(previewElement);

	return cardElement;
}


fetch(`/api/stories`)
.then(response => response.json())
.then(data => {
	let bookCards = document.getElementById("book-cards");

	for(let i = 0; i < data.length; i++) {
		bookCards.appendChild(shortStoryCard(data[i].image, data[i].title, data[i].preview, i));
	}
})
.catch(err => {
	console.log(err);
});


fetch(`/api/quick-writes`)
.then(response => response.json())
.then(data => {
	let quickWriteCards = document.getElementById("list");
	let recent = document.getElementById("recently");

	if(data.length) {
		recent.appendChild(recentCard(data[data.length - 1].image, data[data.length - 1].title, data[data.length - 1].preview, data.length - 1));
	}

	for(let i = 0; i < data.length; i++) {
		quickWriteCards.appendChild(quickWriteCard(data[i].image, data[i].title, data[i].preview, i));
	}
})
.catch(err => {
	console.log(err);
});