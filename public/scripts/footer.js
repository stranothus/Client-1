var footer = document.getElementsByClassName("footer")[0];


/**
 * Creates an instance of HTMLElement based off a string in HTML format
 * 
 * @param node {string} - node model
 * 
 * @returns {void}
 */
function $create(node) {
    var startingTag = String(node.match(/<(?:[^>\s]+)/)[0]);
    	startingTag = startingTag.slice(1, startingTag.length);

    var attributes = (
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
	
    var HTML = String(node.match(/>([^]*)</)[0]);
    	HTML = HTML.slice(1, HTML.length - 1);

    var element = document.createElement(startingTag);
    for (var i = 0; i < attributes.length - 1; i += 2) {
        element.setAttribute(attributes[i], attributes[i + 1].replace(/#\$#/g, "\'"));
    }
    element.innerHTML = HTML;

    return element;
}


var anon = `
	<div class = "nav">
		<a href = "/home">Home</a>
		<span>|</span>
		<a href = "/about">About</a>
		<span>|</span>
		<a href = "/blog">Blog</a>
		<span>|</span>
		<a href = "/books">Stories</a>
		<span>|</span>
		<a href = "/mail-list">Mail</a>
		<span>|</span>
		<a href = "/login">Login</a>
		<span>|</span>
		<a href = "/signup">Sign up</a>
	</div>`;


var user = `
	<div class = "nav">
		<a href = "/home">Home</a>
		<span>|</span>
		<a href = "/about">About</a>
		<span>|</span>
		<a href = "/blog">Blog</a>
		<span>|</span>
		<a href = "/books">Stories</a>
		<span>|</span>
		<a href = "/mail-list">Mail</a>
		<span>|</span>
		<a href = "/logout">Logout</a>
		<span>|</span>
		<a href = "/reset-password">Reset Password</a>
	</div>`;


fetch("/footer")
.then(response => response.text())
.then(data => {
	footer.replaceWith($create(data));
	fetch("/api/is-logged-in")
	.then(response => response.text())
	.then(data => {
		var nav = document.getElementsByClassName("nav")[0];

		if(JSON.parse(data)) {
			nav.innerHTML = user;
		} else {
			nav.innerHTML = anon;
		}
	})
})
.catch(err => {
	console.log(err);
})