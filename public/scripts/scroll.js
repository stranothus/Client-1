var halfScroll = document.getElementsByClassName("half-scroll");

const mobile = /Mobi/i.test(window.navigator.userAgent);

function applyScroll(element) {
	var scroll = element.getBoundingClientRect().top;
	
	if(mobile) {
		element.style.backgroundPosition = "0px " + (-scroll / 3)  + "px";
	} else {
		element.style.backgroundPosition = "0px " + (scroll / 1.5) + "px";
	}
}

for(var i = 0; i < halfScroll.length; i++) {
	var img = halfScroll[i].dataset.src;

	halfScroll[i].style.backgroundImage = "url('" + img + "')";
	halfScroll[i].style.backgroundAttachment = "fixed";
	halfScroll[i].style.backgroundSize = "cover";
	halfScroll[i].style.backgroundRepeat = "no-repeat";

	applyScroll(halfScroll[i]);
}

window.addEventListener("scroll", () => {
	for(var i = 0; i < halfScroll.length; i++) {
		applyScroll(halfScroll[i]);
	}
});