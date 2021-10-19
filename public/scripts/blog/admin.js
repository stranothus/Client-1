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

function setup() {
	fetch("/api/blog-posts")
	.then(response => response.json())
	.then(data => {
		let blogNav = document.getElementsByClassName("blog-nav")[0];
		let blogPosts = document.getElementsByClassName("blog-posts")[0];

		blogNav.innerHTML = "";
		blogPosts.innerHTML = "";

		let topics = {};


		for(let i = 0; i < data.length; i++) {
			let index = data[i];


			//{ create blog post cont

				let postElement = $create(`<div class = "post"></div>`);

				blogPosts.prepend(postElement);

			//}


			//{ create blog post edit

				let postEditButton = $create(`<button data-index = "${i}" >Edit</button>`);
				postEditButton.dataset.created = index.created;

				postEditButton.addEventListener("click", function() {
					let d = this.dataset;
					console.log(d);

					let post = document.getElementsByClassName("post")[document.getElementsByClassName("post").length - 1 - d.index];


					//{ create post edit form

						let postEditForm = $create(`<form method = "POST" action = "/blog" enctype = "multipart/form-data" class = "post">
							<button>Save</button>
							<input type = "hidden" name = "created" value = "${d.created}">
							<input type = "hidden" name = "target" value = "edit-post">
							<input type = "text" name = "title" value = "${post.getElementsByTagName("h2")[0].textContent}">
							<input type = "text" name = "topics" value = "${data[d.index].topics}">
						</form>`);

					//}


					//{ create post edit content

						let postEditContent = $create(`<textarea name = "content"></textarea>`);

						postEditContent.value = post.getElementsByTagName("div")[0].textContent;

						postEditContent.addEventListener("keydown", function(e) {
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

						postEditForm.appendChild(postEditContent);

					//}

					post.replaceWith(postEditForm);

				});

				postElement.appendChild(postEditButton);

			//}


			//{ create blog post delete

				let postDeleteButton = $create(`<button>Delete</button>`);
				postDeleteButton.dataset.created = index.created;

				postDeleteButton.addEventListener("click", function() {
					let d = this.dataset;

					fetch("/blog", {
						method : "POST",
						headers : {
							"Content-Type" : "application/json"
						},
						body : JSON.stringify({
							target : "delete-post",
							created : d.created
						})
					})
					.then(response => {
						setup();
					})
					.catch(err => {
						console.log(err);
					});
				});

				postElement.appendChild(postDeleteButton);

			//}


			//{ create blog post title

				let titleElement = $create(`<h2>${index.title}</h2>`);

				postElement.appendChild(titleElement);

			//}


			//{ create blog post date

				let dateElement = $create(`<h4>${index.created}</h4>`)

				postElement.appendChild(dateElement);

			//}


			//{ create blog post content

				let contentElement = $create(`<div class = "post-content">${index.content}</div>`);

				postElement.appendChild(contentElement);

			//}


			//{ create blog post replies

				for(let e = 0; e < index.replies.length; e++) {
					let endex = index.replies[e];


					//{ create blog post reply cont

						let replyElement = $create(`<div class = "reply"></div>`);

						postElement.appendChild(replyElement);

					//}


					//{ create blog post reply edit button

						let editReplyElement = $create(`<button data-index = "${i}" data-endex = "${e}" data-postCreated = "${index.created}" data-replyCreated = "${endex.created}">Edit</button>`)

						editReplyElement.addEventListener("click", function() {
							let d = this.dataset;
							
							let post = document.getElementsByClassName("post")[document.getElementsByClassName("post").length - 1 - d.index];

							let reply = post.getElementsByClassName("reply")[this.dataset.endex];


							//{ create blog post reply edit form
								let replyEditForm = $create(`<form method = "POST" action = "/blog" enctype = "multipart/form-data" class = "reply"></form>`);
							//}


							//{ create blog post reply edit name

								let replyEditNameElement = reply.getElementsByTagName("h2")[0].cloneNode(true);

								replyEditForm.appendChild(replyEditNameElement);

							//} 


							//{ create blog post reply edit name

								let replyEditDateElement = reply.getElementsByTagName("h4")[0].cloneNode(true);

								replyEditForm.appendChild(replyEditDateElement);

							//} 


							//{ create blog post reply edit target hidden input

								let replyEditTargetElement = $create(`<input type = "hidden" name = "target" value = "edit-reply"></input>`);

								replyEditForm.appendChild(replyEditTargetElement);

							//} 


							//{ create blog post reply edit postID hidden input

								let replyEditPostIDElement = $create(`<input type = "hidden" name = "postCreated" value = "${d.postCreated}"></input>`);

								replyEditForm.appendChild(replyEditPostIDElement);

							//} 


							//{ create blog post reply edit postID hidden input

								let replyEditReplyIDElement = $create(`<input type = "hidden" name = "replyCreated" value = "${d.replyCreated}"></input>`);

								replyEditForm.appendChild(replyEditReplyIDElement);

							//} 

					
							//{ create blog post reply edit textarea 

								let replyEditContentElement = $create(`<textarea name = "content"></textarea>`);

								replyEditContentElement.value = reply.getElementsByTagName("div")[0].textContent;

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

					
							//{ create blog post reply edit submit

								let replyEditSubmitElement = $create(`<button type = "submit">Save</button>`);

								replyEditForm.appendChild(replyEditSubmitElement);

							//}


							reply.replaceWith(replyEditForm);
						});

						replyElement.appendChild(editReplyElement);

					//}


					//{ create blog post reply delete button

						let deleteReplyElement = $create(`<button data-postCreated = "${index.created}" data-replyCreated = "${endex.created}">Delete</button>`);

						deleteReplyElement.addEventListener("click", function() {
							let d = this.dataset;

							fetch("/blog", {
								method : "POST",
								headers : {
									"Content-Type" : "application/json"
								},
								body : JSON.stringify({
									postCreated : d.postCreated,
									replyCreated : d.replyCreated,
									target : "delete-reply"
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

						replyElement.appendChild(deleteReplyElement);

					//}


					//{ create blog post reply ban button

						let banElement = $create(`<button data-name = "${endex.name}">Ban</button>`);

						banElement.addEventListener("click", function() {
							let d = this.dataset;

							fetch("/api/ban-account", {
								method : "POST",
								headers : {
									"Content-Type" : "application/json"
								},
								body : JSON.stringify({
									name : d.name
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

						replyElement.appendChild(banElement);

					//}


					//{ create blog post reply user name

						let nameElement = $create(`<h2>${endex.name}</h2>`);

						replyElement.appendChild(nameElement);

					//}


					//{ create blog post reply date

						let replyDateElement = $create(`<h4>${endex.created}</h4>`);

						replyElement.appendChild(replyDateElement);

					//}


					//{ create blog post reply content

						let replyContentElement = $create(`<div>${endex.content}</div>`);

						replyElement.appendChild(replyContentElement);

					//}

				}
				
			//}


			//{ create reply form

				let replyForm = $create(`<form method = "POST" action = "/blog" enctype = "multipart/form-data" class = "reply-form">
					<input type = "hidden" name = "target" value = "create-reply">
					<input type = "hidden" name = "postCreated" value = "${index.created}">
				</form>`);

				postElement.appendChild(replyForm);

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

				let replySubmit = $create(`<button type = "submit">Send<button>`);

				replyForm.appendChild(replySubmit);

			//}


			//{ create blog nav topics 

				for(let e = 0; e < index.topics.length; e++) {
					let endex = index.topics[e];

					//{ create/find topic folder

						if(typeof topics[endex] === "undefined") {

							//{ create blog nav topic folder contentElement

								let topicFolderElement = $create(`<div class = "topics-drop-down">
									<h3 class = "folder-title">${endex}</h3>
								</div>`);

								blogNav.appendChild(topicFolderElement);

								topics[endex] = {
									topic : endex,
									element : topicFolderElement
								};

							//}
						}

					//}


					//{ append post to appropriate folder

						let navTitleElement = $create(`<div class = "post-link" data-index = "${i}">${index.title}</div>`);

						navTitleElement.addEventListener("click", function() {
							let posts = document.getElementsByClassName("post");
							let index = this.dataset.index;
							let trueIndex = posts.length - index - 1;
							let truePost = posts[trueIndex];
							
							truePost.scrollIntoView({
								behavior : "smooth"
							});
						});

						topics[endex].element.appendChild(navTitleElement);

					//}

				}

			//}
		}


		//{ create blog post form

			let createPostForm = $create(`<form method = "POST" action = "/blog" enctype = "multipart/form-data" class = "reply-form">
				<input type = "hidden" name = "target" value = "create-post">
				<button class = "submit-post">Post</button>
				<input type = "text" name = "title" placeholder = "Title">
				<input type = "text" name = "topics" placeholder = "Topics (seperate with a comma)">
			</form>`);

			createPostForm.classList.add("create-post");

			blogPosts.prepend(createPostForm);

		//}


		//{ create blog post content

			let createPostContentElement = $create(`<textarea name = "content"></textarea>`);

			createPostContentElement.addEventListener("keydown", function(e) {
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
			
			createPostForm.appendChild(createPostContentElement);

		//} 


	});
}


setup();