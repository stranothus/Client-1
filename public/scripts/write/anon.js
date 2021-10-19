const story = window.location.href.split("/").reverse()[0];

/**
 * Creates an instance of HTMLElement based off a string in HTML format
 * 
 * @param node {string} - node model
 * 
 * @returns {void}
 */
function $create(node) {
    let startingTag = String(node.match(/<(?:[^>\s]+)/)[0]);
    	startingTag = startingTag.slice(1, startingTag.length);

    let attributes = (
		node.slice(startingTag.length + 1, startingTag.length + 2) !== ">"

        ?

		String(node
			.slice(startingTag.length + 1)
			.match(/([^>]+)/)[0])
			.replace(/\s/g, "")
			.replace(/\([\"\']/g, "(#$#")
			.replace(/[\"\']\)/g, "#$#)")
			.replace(/\\[\"\']/g, "#$#")
			.split(/[\"\'](?!url\()|=[\"\']/g)
		
        :

        "");
	
    let HTML = String(node.match(/>([^]*)</)[0]);
    	HTML = HTML.slice(1, HTML.length - 1);

    let element = document.createElement(startingTag);
    for (let i = 0; i < attributes.length - 1; i += 2) {
        element.setAttribute(attributes[i], attributes[i + 1].replace(/#\$#/g, "\'"));
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
	fetch(`/api/quick-write/${story}`)
	.then(response => response.json())
	.then(data => {
		let pageTitle = document.getElementsByTagName("title")[0];
		pageTitle.textContent = data.title;

		let title = document.getElementById("title");
		let content = document.getElementById("content");
		let image = document.getElementsByClassName("half-scroll")[0];

		title.textContent = data.title;
		content.appendChild(function () {
			let element = document.createElement("p");
			element.appendChild(document.createTextNode(data.content));
			return element;
		}());
		image.style.backgroundImage = `url("${data.image}")`;


		let forum = document.getElementsByClassName("forum")[0];

		forum.innerHTML = `<a href = "/signup">Sign up to comment</a>`;


		//{ create story comments

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

			}
			
		//}

	})
	.catch(err => {
		console.log(err);
	});
}

setup();