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


			//{ create blog post title

				var titleElement = document.createElement("h2");

				titleElement.textContent = index.title;

				postElement.appendChild(titleElement);

			//}


			//{ create blog post date

				var dateElement = document.createElement("h4");

				dateElement.textContent = index.date;

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


					//{ create blog post reply user name

						var nameElement = document.createElement("h2");

						nameElement.textContent = endex.name;

						replyElement.appendChild(nameElement);

					//}


					//{ create blog post reply date

						var replyDateElement = document.createElement("h4");

						replyDateElement.textContent = endex.date;

						replyElement.appendChild(replyDateElement);

					//}


					//{ create blog post reply content

						var replyContentElement = document.createElement("div");

						replyContentElement.textContent = endex.content;

						replyElement.appendChild(replyContentElement);

					//}
				}

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
	});
}


setup();