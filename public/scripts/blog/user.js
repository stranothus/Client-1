function setup() {
	fetch("/api/user")
	.then(response => response.json())
	.then(email => {
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

					let postElement = document.createElement("div");

					postElement.classList.add("post");

					blogPosts.prepend(postElement);

				//}


				//{ create blog post title

					let titleElement = document.createElement("h2");

					titleElement.textContent = index.title;

					postElement.appendChild(titleElement);

				//}


				//{ create blog post date

					let dateElement = document.createElement("h4");

					dateElement.textContent = index.date;

					postElement.appendChild(dateElement);

				//}


				//{ create blog post content

					let contentElement = document.createElement("div");

					contentElement.textContent = index.content;

					contentElement.classList.add("post-content");

					postElement.appendChild(contentElement);

				//}


				//{ create blog post replies

					for(let e = 0; e < index.replies.length; e++) {
						let endex = index.replies[e];

						//{ create blog post reply cont

							let replyElement = document.createElement("div");

							replyElement.classList.add("reply");

							postElement.appendChild(replyElement);

						//}


						if(email === endex.name) {

							//{ create blog post reply edit button

								let editReplyElement = document.createElement("button");

								editReplyElement.dataset.index = i;
								editReplyElement.dataset.endex = e;
								editReplyElement.dataset.postCreated = index.created;
								editReplyElement.dataset.replyCreated = endex.created;

								editReplyElement.addEventListener("click", function() {
									let d = this.dataset;

									let post = document.getElementsByClassName("post");
                                    post = post[post.length - d.index - 1];
									let reply = post.getElementsByClassName("reply")[d.endex];

									//{ create blog post reply edit form
										let replyEditForm = document.createElement("form");

										replyEditForm.classList.add("reply");

										replyEditForm.setAttribute("method", "POST");
										replyEditForm.setAttribute("action", "/blog");
										replyEditForm.setAttribute("enctype", "multipart/form-data");

										replyEditForm.addEventListener("submit", () => {
											window.setTimeout(setup, 100);
										});
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

										let replyEditTargetElement = document.createElement("input");

										replyEditTargetElement.type = "hidden";
										replyEditTargetElement.name = "target";
										replyEditTargetElement.value = "edit-reply";

										replyEditForm.appendChild(replyEditTargetElement);

									//} 


									//{ create blog post reply edit postID hidden input

										let replyEditPostIDElement = document.createElement("input");

										replyEditPostIDElement.type = "hidden";
										replyEditPostIDElement.name = "postCreated";
										replyEditPostIDElement.value = d.postCreated;

										replyEditForm.appendChild(replyEditPostIDElement);

									//} 


									//{ create blog post reply edit postID hidden input

										let replyEditReplyIDElement = document.createElement("input");

										replyEditReplyIDElement.type = "hidden";
										replyEditReplyIDElement.name = "replyCreated";
										replyEditReplyIDElement.value = d.replyCreated;

										replyEditForm.appendChild(replyEditReplyIDElement);

									//} 

							
									//{ create blog post reply edit textarea 

										let replyEditContentElement = document.createElement("textarea");

										replyEditContentElement.setAttribute("name", "content");
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

										let replyEditSubmitElement = document.createElement("button");

										replyEditSubmitElement.setAttribute("type", "submit");
										replyEditSubmitElement.textContent = "Save";

										replyEditForm.appendChild(replyEditSubmitElement);

									//}


									reply.replaceWith(replyEditForm);
								});

								editReplyElement.textContent = "Edit";

								replyElement.appendChild(editReplyElement);

							//}


							//{ create blog post reply delete button

								let deleteReplyElement = document.createElement("button");

								deleteReplyElement.dataset.postCreated = index.created;
								deleteReplyElement.dataset.replyCreated = endex.created;

								deleteReplyElement.addEventListener("click", function() {
									let d = this.dataset;

									fetch("/blog", {
										method : "POST",
										headers : {
											"Content-Type" : "application/json"
										},
										body : JSON.stringify({
											target : "delete-reply",
											postCreated : d.postCreated,
											replyCreated : d.replyCreated
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

								deleteReplyElement.textContent = "Delete";

								replyElement.appendChild(deleteReplyElement);

							//}

						}


						//{ create blog post reply user name

							let nameElement = document.createElement("h2");

							nameElement.textContent = endex.name;

							replyElement.appendChild(nameElement);

						//}


						//{ create blog post reply date

							let replyDateElement = document.createElement("h4");

							replyDateElement.textContent = endex.date;

							replyElement.appendChild(replyDateElement);

						//}


						//{ create blog post reply content

							let replyContentElement = document.createElement("div");

							replyContentElement.textContent = endex.content;

							replyElement.appendChild(replyContentElement);

						//}

					}
					
				//}


			//{ create reply form

				let replyForm = document.createElement("form");

				replyForm.classList.add("reply-form");

				replyForm.setAttribute("method", "POST");
				replyForm.setAttribute("action", "/blog");
				replyForm.setAttribute("enctype", "multipart/form-data");

				postElement.appendChild(replyForm);

			//}


			//{ create reply target hidden input

				let replyTargetElement = document.createElement("input");

				replyTargetElement.type = "hidden";
				replyTargetElement.name = "target";
				replyTargetElement.value = "create-reply";

				replyForm.appendChild(replyTargetElement);

			//}


			//{ create reply postId hidden input

				let replyPostIDElement = document.createElement("input");

				replyPostIDElement.type = "hidden";
				replyPostIDElement.name = "created";
				replyPostIDElement.value = index.created;

				replyForm.appendChild(replyPostIDElement);

			//}



			//{ create reply textarea

				let replyTextarea = document.createElement("textarea");

				replyTextarea.setAttribute("name", "content");

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

				let replySubmit = document.createElement("button");

				replySubmit.setAttribute("type", "submit");
				replySubmit.textContent = "Send";

				replyForm.appendChild(replySubmit);

			//}


				//{ create blog nav topics 

					for(let e = 0; e < index.topics.length; e++) {
						let endex = index.topics[e];

						//{ create/find topic folder

							if(typeof topics[endex] === "undefined") {

								//{ create blog nav topic folder contentElement

									let topicFolderElement = document.createElement("div");

									topicFolderElement.innerHTML = `<h3 class = "folder-title">${endex}</h3>`;

									topicFolderElement.classList.add("topics-drop-down");

									blogNav.appendChild(topicFolderElement);

									topics[endex] = {
										topic : endex,
										element : topicFolderElement
									};

								//}
							}

						//}


					//{ append post to appropriate folder

						let navTitleElement = document.createElement("div");

						navTitleElement.classList.add("post-link");

						navTitleElement.textContent = index.title;

						navTitleElement.dataset.index = i;

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
		});
	})
	.catch(err => {
		console.log(err);
	});
}


setup();