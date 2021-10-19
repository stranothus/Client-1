const write = window.location.href.split("/").reverse()[0];

/**
 * Creates an instance of HTMLElement based off a string in HTML format
 * 
 * @param node {string} - node model
 * 
 * @returns {void}
 */
function $create(node) {
	node = node.trim();
	let startingTag = node.match(/<(?:[^>\s]+)/)[0];
	startingTag = startingTag.slice(1, startingTag.length);


	let attributes = 
		node.slice(startingTag.length + 1, startingTag.length + 2) !== ">"
		?
		(node.slice(startingTag.length + 1).match(/([^>]+)/)[0]).replace(/\s/g, "").replace(/\([\"\']/g, "(#$#").replace(/[\"\']\)/g, "#$#)").replace(/\\[\"\']/g, "#$#").split(/[\"\'](?!url\()|=[\"\']/g)
		:
		"";


	let HTML = node.match(/>([^]*)</)[0];
	HTML = HTML.slice(1, HTML.length - 1);


	let element = document.createElement(startingTag);

	for(let i = 0; i < attributes.length - 1; i+=2) {
		element.setAttribute(attributes[i], attributes[i + 1].replace(/#\$#/g, "\'").replace(/%20/g, " "));
	}

	element.innerHTML = HTML;

	return element;
}
/**
 * Initiation function
 * 
 * returns {void}
 */

function setup() {
	fetch("/api/user")
	.then(response => response.json())
	.then(email => {
		fetch(`/api/quick-write/${write}`)
		.then(response => response.json())
		.then(data => {
			let pageTitle = document.getElementsByTagName("title")[0];
			pageTitle.textContent = data.title;

			let title = document.getElementById("title");
			let content = document.getElementById("content");
			let image = document.getElementsByClassName("half-scroll")[0];

			title.textContent = data.title;
            content.innerHTML = "";
			content.appendChild(function () {
				let element = document.createElement("p");
				element.appendChild(document.createTextNode(data.content));
				return element;
			}());
			image.style.backgroundImage = `url("${data.image}")`;


			let forum = document.getElementsByClassName("forum")[0];

			forum.innerHTML = "";


			//{ create write comments

				for(let e = 0; e < data.replies.length; e++) {
					let endex = data.replies[e];


					//{ create blog post reply cont

						let replyElement = $create(`<div class = "reply">
								<h2>${endex.name}</h2>
								<h4>${endex.created}</h4>
								<div>${endex.content}</div>
							</div>
						`);

						forum.appendChild(replyElement);

					//}

					if(email === endex.name) {
						//{ create blog post reply delete button

							let deleteReplyElement = $create(`<button data-created = "${endex.created.replace(/\s/g, "%20")}">Delete</button>`);

							deleteReplyElement.addEventListener("click", function() {
								let d = this.dataset;
                                
								fetch("/story-post", {
									method : "POST",
									headers : {
										"Content-Type" : "application/json"
									},
									body : JSON.stringify({
										postCreated : data.created,
										replyCreated : d.created,
										target : "write-delete"
									})
								})
								.then(response => {
									setup();
								})
								.catch(err => {
									console.log(err);
								});

								setup();
							});

							replyElement.prepend(deleteReplyElement);

						//}


						//{ create quick write reply edit button

							let editReplyElement = $create(`<button data-endex = "${e}" data-created = "${endex.created.replace(/\s/g, "%20")}"></button`);

							editReplyElement.addEventListener("click", function() {
								let d = this.dataset;
								
								let reply = document.getElementsByClassName("reply")[d.endex];


								//{ create blog post reply edit form

									let replyEditForm = $create(`<form method = "POST" action = "/story-post" class = "reply">
											<input type = "hidden" name = "target" value = "write-edit">
											<input type = "hidden" name = "postCreated" value = "${data.created}">
											<input type = "hidden" name = "replyCreated" value = "${d.created}">
											<input type = "hidden" name = "title" value = "${write}">
											<button type = "submit">Save</button>
										</form>
									`);

								//}


								//{ create blog post reply edit name

									let replyEditNameElement = reply.getElementsByTagName("h2")[0].cloneNode(true);

									replyEditForm.appendChild(replyEditNameElement);

								//} 


								//{ create blog post reply edit name

									let replyEditDateElement = reply.getElementsByTagName("h4")[0].cloneNode(true);

									replyEditForm.appendChild(replyEditDateElement);

								//}

						
								//{ create blog post reply edit textarea 

									let replyEditContentElement = $create(`<textarea name = "content">${reply.getElementsByTagName("div")[0].textContent}</textarea>`);

									replyEditContentElement.addEventListener("keydown", function(e) {
										if(e.keyCode === 9) {
											e.preventDefault();
											let start = this.selectionStart;
											let end = this.selectionEnd;

											// set textarea value to: text before caret + tab + text after caret
											this.value = this.value.substring(0, start) +
											"\t" + this.value.substring(end);

											// put caret at right position again
											this.selectionStart =
											this.selectionEnd = start + 1;
										}
									});

									replyEditForm.appendChild(replyEditContentElement);

								//}


								reply.replaceWith(replyEditForm);
							});

							editReplyElement.textContent = "Edit";

							replyElement.prepend(editReplyElement);

						//}

					}
				}
				
			//}


			//{ create reply form

				let replyForm = $create(`<form class = "reply-form" method = "POST" action = "/story-post">
						<input type = "hidden" name = "target" value = "write-post">
						<input type = "hidden" name = "created" value = "${data.created}">
						<input type = "hidden" name = "title" value = "${write}">
					</form>
				`);

				forum.prepend(replyForm);

			//}


			//{ create reply textarea

				let replyTextarea = $create(`<textarea name = "content"></textarea>`);

				replyTextarea.addEventListener("keydown", function(e) {
					if(e.keyCode === 9) {
						e.preventDefault();
						let start = this.selectionStart;
						let end = this.selectionEnd;

						// set textarea value to: text before caret + tab + text after caret
						this.value = this.value.substring(0, start) +
						"\t" + this.value.substring(end);

						// put caret at right position again
						this.selectionStart =
						this.selectionEnd = start + 1;
					}
				});

				replyForm.appendChild(replyTextarea);

			//}


			//{ create reply submit

				let replySubmit = $create(`<button type = "submit">Send</button>`);

				replyForm.appendChild(replySubmit);

			//}
		})
	})
	.catch(err => {
		console.log(err);
	});
}

setup();