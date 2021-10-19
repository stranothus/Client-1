var textarea = document.getElementsByTagName("textarea")[0];

textarea.addEventListener("keydown", function(e) {
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


var input = document.getElementById("story-image");
var label = document.getElementById("select-image");
var parallax = document.getElementsByClassName("half-scroll")[0];

input.addEventListener("change", () => {
	var file = input.files[0];

	label.style.background = `transparent`;
	parallax.style.backgroundImage = `url("${URL.createObjectURL(file)}")`;
});