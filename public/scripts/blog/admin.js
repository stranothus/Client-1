function setup() {
	fetch("/api/blog-posts")
	.then(response => response.json())
	.then(data => {
		var blogNav = document.getElementsByClassName("blog-nav")[0];
		var blogPosts = document.getElementsByClassName("blog-posts")[0];

		blogNav.innerHTML = "";
		blogPosts.innerHTML = "";

		var topics = {};


		for(var i = 0; i < data.length; i++) {
			var index = data[i];


			//{ create blog post cont

				var postElement = document.createElement("div");

				postElement.classList.add("post");

				blogPosts.prepend(postElement);

			//}


			//{ create blog post edit

				var postEditButton = document.createElement("button");

				postEditButton.textContent = "Edit";

				postEditButton.dataset.index = i;
				postEditButton.dataset.created = index.created;

				postEditButton.addEventListener("click", function() {
					var d = this.dataset;

					var post = document.getElementsByClassName("post")[document.getElementsByClassName("post").length - 1 - d.index];


					//{ create post edit form

						var postEditForm = document.createElement("form");

						postEditForm.setAttribute("method", "POST");
						postEditForm.setAttribute("action", "/blog");

						postEditForm.classList.add("post");

					//}


					//{ create post edit submit

						var postEditTitle = document.createElement("button");
						
						postEditTitle.textContent = "Save";

						postEditForm.appendChild(postEditTitle);

					//}


					//{ create post edit hidden postId

						var postEditPostId = document.createElement("input");
						
						postEditPostId.type = "hidden";
						postEditPostId.name = "created";
						postEditPostId.value = d.created;

						postEditForm.appendChild(postEditPostId);

					//}


					//{ create post edit hidden target

						var postEditTarget = document.createElement("input");
						
						postEditTarget.type = "hidden";
						postEditTarget.name = "target";
						postEditTarget.value = "edit-post";

						postEditForm.appendChild(postEditTarget);

					//}


					//{ create post edit title

						var postEditTitle = document.createElement("input");
						
						postEditTitle.type = "text";
						postEditTitle.name = "title";
						postEditTitle.value = post.getElementsByTagName("h2")[0].textContent;

						postEditForm.appendChild(postEditTitle);

					//}


					//{ create post edit topics

						var postEditTopics = document.createElement("input");
						
						postEditTopics.type = "text";
						postEditTopics.name = "topics";
						postEditTopics.value = data[d.index].topics;

						postEditForm.appendChild(postEditTopics);

					//}


					//{ create post edit content

						var postEditContent = document.createElement("textarea");
						
						postEditContent.name = "content";
						postEditContent.value = post.getElementsByTagName("div")[0].textContent;

						postEditContent.addEventListener("keydown", function(e) {
							if(e.keyCode === 9) {
								e.preventDefault();
								var start = this.selectionStart;
								var end = this.selectionEnd;

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

				var postDeleteButton = document.createElement("button");

				postDeleteButton.textContent = "Delete";

				postDeleteButton.dataset.created = index.created;

				postDeleteButton.addEventListener("click", function() {
					var d = this.dataset;

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

				var titleElement = document.createElement("h2");

				titleElement.textContent = index.title;

				postElement.appendChild(titleElement);

			//}


			//{ create blog post date

				var dateElement = document.createElement("h4");

				dateElement.textContent = index.created;

				postElement.appendChild(dateElement);

			//}


			//{ create blog post content

				var contentElement = document.createElement("div");

				contentElement.textContent = index.content;

				contentElement.classList.add("post-content");

				postElement.appendChild(contentElement);

			//}


			//{ create blog post replies

				for(var e = 0; e < index.replies.length; e++) {
					var endex = index.replies[e];


					//{ create blog post reply cont

						var replyElement = document.createElement("div");

						replyElement.classList.add("reply");

						postElement.appendChild(replyElement);

					//}


					//{ create blog post reply edit button

						var editReplyElement = document.createElement("button");

						editReplyElement.dataset.index = i;
						editReplyElement.dataset.endex = e;
						editReplyElement.dataset.postCreated = index.created;
						editReplyElement.dataset.replyCreated = endex.created;

						editReplyElement.addEventListener("click", function() {
							var d = this.dataset;
							
							var post = document.getElementsByClassName("post")[document.getElementsByClassName("post").length - 1 - d.index];

							var reply = post.getElementsByClassName("reply")[this.dataset.endex];


							//{ create blog post reply edit form
								var replyEditForm = document.createElement("form");

								replyEditForm.classList.add("reply");

								replyEditForm.setAttribute("method", "POST");
								replyEditForm.setAttribute("action", "/blog");
							//}


							//{ create blog post reply edit name

								var replyEditNameElement = reply.getElementsByTagName("h2")[0].cloneNode(true);

								replyEditForm.appendChild(replyEditNameElement);

							//} 


							//{ create blog post reply edit name

								var replyEditDateElement = reply.getElementsByTagName("h4")[0].cloneNode(true);

								replyEditForm.appendChild(replyEditDateElement);

							//} 


							//{ create blog post reply edit target hidden input

								var replyEditTargetElement = document.createElement("input");

								replyEditTargetElement.type = "hidden";
								replyEditTargetElement.name = "target";
								replyEditTargetElement.value = "edit-reply";

								replyEditForm.appendChild(replyEditTargetElement);

							//} 


							//{ create blog post reply edit postID hidden input

								var replyEditPostIDElement = document.createElement("input");

								replyEditPostIDElement.type = "hidden";
								replyEditPostIDElement.name = "postCreated";
								replyEditPostIDElement.value = d.postCreated;

								replyEditForm.appendChild(replyEditPostIDElement);

							//} 


							//{ create blog post reply edit postID hidden input

								var replyEditReplyIDElement = document.createElement("input");

								replyEditReplyIDElement.type = "hidden";
								replyEditReplyIDElement.name = "replyCreated";
								replyEditReplyIDElement.value = d.replyCreated;

								replyEditForm.appendChild(replyEditReplyIDElement);

							//} 

					
							//{ create blog post reply edit textarea 

								var replyEditContentElement = document.createElement("textarea");

								replyEditContentElement.setAttribute("name", "content");
								replyEditContentElement.value = reply.getElementsByTagName("div")[0].textContent;

								replyEditContentElement.addEventListener("keydown", function(e) {
									if(e.keyCode === 9) {
										e.preventDefault();
										var start = this.selectionStart;
										var end = this.selectionEnd;

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

								var replyEditSubmitElement = document.createElement("button");

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

						var deleteReplyElement = document.createElement("button");

						deleteReplyElement.dataset.postCreated = index.created;
						deleteReplyElement.dataset.replyCreated = endex.created;

						deleteReplyElement.addEventListener("click", function() {
							var d = this.dataset;

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

						deleteReplyElement.textContent = "Delete";

						replyElement.appendChild(deleteReplyElement);

					//}


					//{ create blog post reply ban button

						var banElement = document.createElement("button");

						banElement.dataset.name = endex.name;

						banElement.addEventListener("click", function() {
							var d = this.dataset;

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

						banElement.textContent = "Ban";

						replyElement.appendChild(banElement);

					//}


					//{ create blog post reply user name

						var nameElement = document.createElement("h2");

						nameElement.textContent = endex.name;

						replyElement.appendChild(nameElement);

					//}


					//{ create blog post reply date

						var replyDateElement = document.createElement("h4");

						replyDateElement.textContent = endex.created;

						replyElement.appendChild(replyDateElement);

					//}


					//{ create blog post reply content

						var replyContentElement = document.createElement("div");

						replyContentElement.textContent = endex.content;

						replyElement.appendChild(replyContentElement);

					//}

				}
				
			//}


			//{ create reply form

				var replyForm = document.createElement("form");

				replyForm.classList.add("reply-form");

				replyForm.setAttribute("method", "POST");
				replyForm.setAttribute("action", "/blog");

				postElement.appendChild(replyForm);

			//}


			//{ create reply target hidden input

				var replyTargetElement = document.createElement("input");

				replyTargetElement.type = "hidden";
				replyTargetElement.name = "target";
				replyTargetElement.value = "create-reply";

				replyForm.appendChild(replyTargetElement);

			//}


			//{ create reply postId hidden input

				var replyPostIDElement = document.createElement("input");

				replyPostIDElement.type = "hidden";
				replyPostIDElement.name = "postCreated";
				replyPostIDElement.value = index.created;

				replyForm.appendChild(replyPostIDElement);

			//}



			//{ create reply textarea

				var replyTextarea = document.createElement("textarea");

				replyTextarea.setAttribute("name", "content");

				replyTextarea.addEventListener("keydown", function(e) {
					if(e.keyCode === 9) {
						e.preventDefault();
						var start = this.selectionStart;
						var end = this.selectionEnd;

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

				var replySubmit = document.createElement("button");

				replySubmit.setAttribute("type", "submit");
				replySubmit.textContent = "Send";

				replyForm.appendChild(replySubmit);

			//}


			//{ create blog nav topics 

				for(var e = 0; e < index.topics.length; e++) {
					var endex = index.topics[e];

					//{ create/find topic folder

						if(typeof topics[endex] === "undefined") {

							//{ create blog nav topic folder contentElement

								var topicFolderElement = document.createElement("div");

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

						var navTitleElement = document.createElement("div");

						navTitleElement.classList.add("post-link");

						navTitleElement.textContent = index.title;

						navTitleElement.dataset.index = i;

						navTitleElement.addEventListener("click", function() {
							var posts = document.getElementsByClassName("post");
							var index = this.dataset.index;
							var trueIndex = posts.length - index - 1;
							var truePost = posts[trueIndex];
							
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

			var createPostForm = document.createElement("form");

			createPostForm.setAttribute("method", "POST");
			createPostForm.setAttribute("action", "/blog");

			createPostForm.classList.add("create-post");

			blogPosts.prepend(createPostForm);

		//}


		//{ create blog post target hidden input

			var createPostTargetElement = document.createElement("input");

			createPostTargetElement.type = "hidden";
			createPostTargetElement.name = "target";
			createPostTargetElement.value = "create-post";

			createPostForm.appendChild(createPostTargetElement);

		//} 


		//{ create blog post submit button

			var createPostSubmitElement = document.createElement("button");

			createPostSubmitElement.textContent = "Post";

			createPostSubmitElement.classList.add("submit-post")

			createPostForm.appendChild(createPostSubmitElement);

		//} 


		//{ create blog post title

			var createPostTitleElement = document.createElement("input");

			createPostTitleElement.type = "text";
			createPostTitleElement.name = "title";
			createPostTitleElement.placeholder = "Title";

			createPostForm.appendChild(createPostTitleElement);

		//} 


		//{ create blog post topics

			var createPostTopicsElement = document.createElement("input");

			createPostTopicsElement.type = "text";
			createPostTopicsElement.name = "topics";
			createPostTopicsElement.placeholder = "Topics (seperate with a comma)";

			createPostForm.appendChild(createPostTopicsElement);

		//} 


		//{ create blog post content

			var createPostContentElement = document.createElement("textarea");

			createPostContentElement.name = "content";

			createPostContentElement.addEventListener("keydown", function(e) {
				if(e.keyCode === 9) {
					e.preventDefault();
					var start = this.selectionStart;
					var end = this.selectionEnd;

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